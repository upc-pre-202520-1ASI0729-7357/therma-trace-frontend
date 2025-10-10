import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule
  ],
  template: `
    <div class="empty-state">
      <mat-icon class="empty-icon">{{ icon }}</mat-icon>
      <h3>{{ title | translate }}</h3>
      <p>{{ description | translate }}</p>
      <button *ngIf="showButton" mat-raised-button color="primary" (click)="onButtonClick()">
        <mat-icon>{{ buttonIcon }}</mat-icon>
        {{ buttonText | translate }}
      </button>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      text-align: center;
    }

    .empty-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #bdbdbd;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      font-weight: 500;
      margin: 0 0 8px 0;
      color: #666;
    }

    .empty-state p {
      color: #999;
      margin-bottom: 24px;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon: string = 'inventory_2';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() showButton: boolean = false;
  @Input() buttonText: string = '';
  @Input() buttonIcon: string = 'add';
  @Output() buttonClick = new EventEmitter<void>();

  onButtonClick(): void {
    this.buttonClick.emit();
  }
}
