import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmationModalData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: 'warning' | 'info' | 'danger';
}

@Component({
  selector: 'app-confirmation-modal',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.css'
})
export class ConfirmationModal {
  protected dialogRef = inject(MatDialogRef<ConfirmationModal>);
  protected data = inject<ConfirmationModalData>(MAT_DIALOG_DATA);

  protected get iconName(): string {
    switch (this.data.type) {
      case 'warning':
        return 'warning';
      case 'danger':
        return 'error';
      case 'info':
      default:
        return 'info';
    }
  }

  protected get iconColor(): string {
    switch (this.data.type) {
      case 'warning':
        return '#ff9800';
      case 'danger':
        return '#d32f2f';
      case 'info':
      default:
        return '#4A90E2';
    }
  }

  protected confirm(): void {
    this.dialogRef.close(true);
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
