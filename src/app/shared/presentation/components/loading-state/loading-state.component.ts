import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  template: `
    <div class="loading-container">
      <mat-spinner diameter="50"></mat-spinner>
      <p>{{ 'common.loading' | translate }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      gap: 16px;
    }

    .loading-container p {
      color: #666;
      font-weight: 500;
    }
  `]
})
export class LoadingStateComponent {}
