import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Medicament } from '../../../domain/model/medicament.entity';

@Component({
  selector: 'app-medicament-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    TranslateModule
  ],
  template: `
    <mat-card class="medicament-card" appearance="outlined">
      <div class="card-image-container">
        <img
          mat-card-image
          [src]="medicament.image"
          [alt]="medicament.name"
          (error)="onImageError($event)"
          class="medicament-image"
        />
        <div class="card-actions-overlay">
          <button mat-mini-fab color="primary" (click)="onEdit()" [matTooltip]="'common.edit' | translate">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-mini-fab color="warn" (click)="onDelete()" [matTooltip]="'common.delete' | translate">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>

      <mat-card-header>
        <mat-card-title>{{ medicament.name }}</mat-card-title>
        <mat-card-subtitle>
          <mat-chip-set>
            <mat-chip [class]="isExpired ? 'status-expired' : 'status-active'">
              <mat-icon matChipAvatar>
                {{ isExpired ? 'schedule' : 'check_circle' }}
              </mat-icon>
              {{ isExpired ? ('medicaments.expired' | translate) : ('medicaments.active' | translate) }}
            </mat-chip>
          </mat-chip-set>
        </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <div class="medicament-info">
          <div class="info-item">
            <mat-icon color="primary">thermostat</mat-icon>
            <span class="info-label">{{ 'medicaments.temperature' | translate }}:</span>
            <span class="info-value">{{ medicament.temperature }}</span>
          </div>
          <div class="info-item">
            <mat-icon color="primary">event</mat-icon>
            <span class="info-label">{{ 'medicaments.expirationDate' | translate }}:</span>
            <span class="info-value">{{ medicament.expirationDate }}</span>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./medicament-card.component.css']
})
export class MedicamentCardComponent {
  @Input() medicament!: Medicament;
  @Input() isExpired: boolean = false;
  @Output() edit = new EventEmitter<Medicament>();
  @Output() delete = new EventEmitter<Medicament>();

  onEdit(): void {
    this.edit.emit(this.medicament);
  }

  onDelete(): void {
    this.delete.emit(this.medicament);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'https://via.placeholder.com/300x200?text=Medicine';
    }
  }
}
