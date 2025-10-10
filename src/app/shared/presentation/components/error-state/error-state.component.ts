import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  template: `
    <div class="error-container">
      <mat-icon color="warn">error</mat-icon>
      <p>{{ errorMessage }}</p>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 24px;
      margin: 16px;
      background-color: #ffebee;
      border-radius: 8px;
      border-left: 4px solid #f44336;
    }

    .error-container p {
      color: #c62828;
      font-weight: 500;
      margin: 0;
    }
  `]
})
export class ErrorStateComponent {
  @Input() errorMessage: string = '';
}
