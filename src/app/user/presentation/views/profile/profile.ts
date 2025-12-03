import { Component, signal, inject, effect, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserStore } from '../../../application/user.store';
import { PaymentModal } from '../../../../shared/presentation/components/modals/payment-modal';
import { ConfirmationModal } from '../../../../shared/presentation/components/modals/confirmation-modal';

/**
 * Profile view component
 * Displays and allows editing of user profile information
 */
@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  protected store = inject(UserStore);
  private dialog = inject(MatDialog);
  private translate = inject(TranslateService);


  protected isEditMode = signal(false);


  protected currentLanguageName = computed(() => {
    const currentLang = this.translate.getCurrentLang() || this.translate.getFallbackLang() || 'en';
    const language = this.store.languages().find(lang => lang.code === currentLang);
    return language?.name || 'English';
  });


  protected formData: {
    fullName: string;
    email: string;
    phone: string;
    timezoneId: string;
    planId: string;
    languageId: string;
  } = {
    fullName: '',
    email: '',
    phone: '',
    timezoneId: '',
    planId: '',
    languageId: ''
  };


  private originalFormData: typeof this.formData = { ...this.formData };

  constructor() {

    effect(() => {
      const user = this.store.user();
      if (user) {
        this.formData = {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          timezoneId: user.timezoneId,
          planId: user.planId,
          languageId: user.languageId
        };
        this.originalFormData = { ...this.formData };
      }
    });
  }

  ngOnInit(): void {

    this.store.loadUserData();
  }

  /**
   * Toggle edit mode
   * When canceling, restore original form data
   */
  protected toggleEditMode(): void {
    if (this.isEditMode()) {

      this.formData = { ...this.originalFormData };
      this.isEditMode.set(false);
    } else {

      this.originalFormData = { ...this.formData };
      this.isEditMode.set(true);
    }
  }

  /**
   * Save profile changes
   * Calls the store to update the profile via API
   */
  protected saveProfile(): void {
    const user = this.store.user();
    if (!user) return;


    const updatedUser = {
      id: user.id,
      fullName: this.formData.fullName,
      email: this.formData.email,
      phone: this.formData.phone,
      timezoneId: this.formData.timezoneId,
      planId: this.formData.planId,
      languageId: this.formData.languageId,
      avatar: user.avatar,
      role: user.role,
      paymentMethodId: user.paymentMethodId
    };


    this.store.updateProfile(updatedUser);


    this.isEditMode.set(false);
  }

  /**
   * Open payment modal to manage payment method
   */
  protected openPaymentModal(): void {
    const dialogRef = this.dialog.open(PaymentModal, {
      width: '600px',
      data: {
        paymentMethod: this.store.paymentMethod()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action) {
        const user = this.store.user();
        if (!user) return;

        if (result.action === 'deleted') {

          const updatedUser = {
            ...user,
            paymentMethodId: null
          };
          this.store.updateProfile(updatedUser);
        } else if (result.action === 'created' && result.paymentMethod) {

          const updatedUser = {
            ...user,
            paymentMethodId: result.paymentMethod.id
          };
          this.store.updateProfile(updatedUser);
        } else {

          this.store.loadProfile();
        }
      }
    });
  }

  /**
   * Cancel current plan and downgrade to Freemium
   */
  protected cancelPlan(): void {
    const dialogRef = this.dialog.open(ConfirmationModal, {
      width: '400px',
      data: {
        title: this.translate.instant('profile.modals.cancelPlan.title'),
        message: this.translate.instant('profile.modals.cancelPlan.message'),
        confirmText: this.translate.instant('profile.modals.cancelPlan.confirm'),
        cancelText: this.translate.instant('profile.modals.cancelPlan.cancel'),
        type: 'warning'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.formData.planId = 'FREEMIUM';
        this.saveProfile();
      }
    });
  }

  /**
   * Upgrade to next plan tier
   */
  protected upgradePlan(): void {
    const currentPlanId = this.formData.planId.toLowerCase();
    let nextPlanId: string;
    let planName: string;

    // Determine next plan (backend uses UPPERCASE IDs)
    if (currentPlanId === 'freemium') {
      nextPlanId = 'PREMIUM';
      planName = 'Premium';
    } else if (currentPlanId === 'premium') {
      nextPlanId = 'ENTERPRISE';
      planName = 'Enterprise';
    } else {
      return; // Already at highest tier
    }

    // Check if payment method exists
    if (!this.store.paymentMethod()) {
      const dialogRef = this.dialog.open(ConfirmationModal, {
        width: '400px',
        data: {
          title: this.translate.instant('profile.modals.paymentRequired.title'),
          message: this.translate.instant('profile.modals.paymentRequired.message'),
          confirmText: this.translate.instant('profile.modals.paymentRequired.confirm'),
          cancelText: this.translate.instant('common.cancel'),
          type: 'warning'
        }
      });

      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed) {
          this.openPaymentModal();
        }
      });
      return;
    }


    const plan = this.store.plans().find(p => p.id.toLowerCase() === nextPlanId.toLowerCase());
    const dialogRef = this.dialog.open(ConfirmationModal, {
      width: '400px',
      data: {
        title: this.translate.instant('profile.modals.upgradePlan.title', { planName }),
        message: this.translate.instant('profile.modals.upgradePlan.message', { planName, price: plan?.price }),
        confirmText: this.translate.instant('profile.modals.upgradePlan.confirm'),
        cancelText: this.translate.instant('common.cancel'),
        type: 'info'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.formData.planId = nextPlanId;
        this.saveProfile();
      }
    });
  }
}
