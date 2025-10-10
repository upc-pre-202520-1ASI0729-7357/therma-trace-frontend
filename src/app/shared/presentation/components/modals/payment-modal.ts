import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PaymentMethod } from '../../../../user/domain/user.entity';
import { UserApi } from '../../../../user/infrastructure/user-api';
import { ConfirmationModal } from './confirmation-modal';

export interface PaymentModalData {
  paymentMethod: PaymentMethod | null;
}

@Component({
  selector: 'app-payment-modal',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    TranslatePipe
  ],
  templateUrl: './payment-modal.html',
  styleUrl: './payment-modal.css'
})
export class PaymentModal {
  private dialogRef = inject(MatDialogRef<PaymentModal>);
  protected data = inject<PaymentModalData>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private userApi = inject(UserApi);
  private dialog = inject(MatDialog);
  private translate = inject(TranslateService);

  protected paymentForm: FormGroup;
  protected isEditMode = signal(false);
  protected hasPaymentMethod = signal(!!this.data.paymentMethod);

  constructor() {
    this.paymentForm = this.fb.group({
      cardholderName: [this.data.paymentMethod?.cardholderName || '', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryMonth: [this.data.paymentMethod?.expiryMonth || '', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)]],
      expiryYear: [this.data.paymentMethod?.expiryYear || '', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });

    if (this.data.paymentMethod) {
      this.paymentForm.disable();
    }
  }

  protected get displayCardNumber(): string {
    if (this.data.paymentMethod) {
      return `**** **** **** ${this.data.paymentMethod.lastFourDigits}`;
    }
    return '';
  }

  protected get displayExpiry(): string {
    if (this.data.paymentMethod) {
      return `${this.data.paymentMethod.expiryMonth}/${this.data.paymentMethod.expiryYear}`;
    }
    return '';
  }

  protected enableEdit(): void {
    this.isEditMode.set(true);
    this.paymentForm.enable();
  }

  protected cancelEdit(): void {
    this.isEditMode.set(false);
    this.paymentForm.patchValue({
      cardholderName: this.data.paymentMethod?.cardholderName || '',
      expiryMonth: this.data.paymentMethod?.expiryMonth || '',
      expiryYear: this.data.paymentMethod?.expiryYear || ''
    });
    this.paymentForm.get('cardNumber')?.setValue('');
    this.paymentForm.get('cvv')?.setValue('');
    if (this.data.paymentMethod) {
      this.paymentForm.disable();
    }
  }

  protected savePayment(): void {
    if (this.paymentForm.valid) {
      const formValue = this.paymentForm.value;
      const cardNumber = formValue.cardNumber;
      const lastFourDigits = cardNumber.slice(-4);

      const paymentData = {
        cardholderName: formValue.cardholderName,
        lastFourDigits: lastFourDigits,
        expiryMonth: formValue.expiryMonth,
        expiryYear: formValue.expiryYear,
        cardType: this.detectCardType(cardNumber)
      };

      if (this.data.paymentMethod) {
        // Update existing
        const updatedPaymentMethod: PaymentMethod = {
          ...this.data.paymentMethod,
          ...paymentData
        };
        this.userApi.updatePaymentMethod(updatedPaymentMethod, this.data.paymentMethod.id).subscribe({
          next: (updated: PaymentMethod) => {
            this.dialogRef.close({ action: 'updated', paymentMethod: updated });
          },
          error: (err: Error) => console.error('Error updating payment method:', err)
        });
      } else {
        // Create new - Note: ID will be assigned by backend
        const newPaymentMethod: PaymentMethod = {
          id: 0, // Temporary ID, backend will assign real one
          ...paymentData
        };
        this.userApi.createPaymentMethod(newPaymentMethod).subscribe({
          next: (created: PaymentMethod) => {
            this.dialogRef.close({ action: 'created', paymentMethod: created });
          },
          error: (err: Error) => console.error('Error creating payment method:', err)
        });
      }
    }
  }

  protected deletePayment(): void {
    if (this.data.paymentMethod) {
      const confirmDialogRef = this.dialog.open(ConfirmationModal, {
        width: '400px',
        data: {
          title: this.translate.instant('payment.modals.delete.title'),
          message: this.translate.instant('payment.modals.delete.message'),
          confirmText: this.translate.instant('payment.modals.delete.confirm'),
          cancelText: this.translate.instant('common.cancel'),
          type: 'danger'
        }
      });

      confirmDialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed && this.data.paymentMethod) {
          this.userApi.deletePaymentMethod(this.data.paymentMethod.id).subscribe({
            next: () => {
              this.dialogRef.close({ action: 'deleted' });
            },
            error: (err: Error) => console.error('Error deleting payment method:', err)
          });
        }
      });
    }
  }

  protected close(): void {
    this.dialogRef.close();
  }

  private detectCardType(cardNumber: string): string {
    // Card type detection based on first digits
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('51') || cardNumber.startsWith('52') ||
      cardNumber.startsWith('53') || cardNumber.startsWith('54') ||
      cardNumber.startsWith('55')) return 'Mastercard';
    if (cardNumber.startsWith('34') || cardNumber.startsWith('37')) return 'American Express';
    if (cardNumber.startsWith('6011') || cardNumber.startsWith('65')) return 'Discover';
    if (cardNumber.startsWith('35')) return 'JCB';
    if (cardNumber.startsWith('2') || cardNumber.startsWith('6')) return 'Mastercard';
    return 'Credit Card';
  }
}
