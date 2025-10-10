import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  icon?: string;
  confirmColor?: 'primary' | 'accent' | 'warn';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, TranslateModule],
  template: `
    <div class="confirm-dialog">
      <div mat-dialog-title class="dialog-title">
        <mat-icon *ngIf="data.icon" [color]="data.confirmColor || 'primary'">{{ data.icon }}</mat-icon>
        <span>{{ data.title }}</span>
      </div>

      <div mat-dialog-content class="dialog-content">
        <p>{{ data.message }}</p>
      </div>

      <div mat-dialog-actions class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-btn">
          <mat-icon>cancel</mat-icon>
          {{ data.cancelText }}
        </button>
        <button mat-raised-button [color]="data.confirmColor || 'primary'" (click)="onConfirm()" class="confirm-btn">
          <mat-icon>check</mat-icon>
          {{ data.confirmText }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      min-width: 350px;
      max-width: 500px;
    }

    .dialog-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
      padding: 24px 24px 16px;
      margin: 0;
    }

    .dialog-content {
      padding: 0 24px 20px;
    }

    .dialog-content p {
      margin: 0;
      font-size: 1rem;
      line-height: 1.5;
      color: #666;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 8px 24px 24px;
      margin: 0;
    }

    .cancel-btn,
    .confirm-btn {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cancel-btn {
      color: #666;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
