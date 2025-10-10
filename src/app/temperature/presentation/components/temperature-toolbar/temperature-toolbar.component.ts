import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-temperature-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    TranslateModule
  ],
  template: `
    <mat-toolbar class="header-toolbar" color="primary">
      <span class="title-with-icon">
        <mat-icon>thermostat</mat-icon>
        {{ 'temperature.title' | translate }}
      </span>
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
      margin-bottom: 24px;
    }

    .title-with-icon {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.25rem;
      font-weight: 500;
    }
  `]
})
export class TemperatureToolbarComponent {}
