import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { TemperatureMedicine } from '../../../domain/model/medicine.entity';

export interface TemperatureFormData {
  medicineId: number;
  temperature: number | null;
  state: string;
  stock: number | null;
  location: string;
}

@Component({
  selector: 'app-temperature-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <mat-card class="modal-content" (click)="$event.stopPropagation()">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>edit</mat-icon>
            {{ 'temperature.editMedicine' | translate }}
          </mat-card-title>
          <button mat-icon-button (click)="onClose()" class="close-btn">
            <mat-icon>close</mat-icon>
          </button>
        </mat-card-header>

        <mat-card-content>
          <form (ngSubmit)="onSubmit()" class="medicine-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'temperature.medicineId' | translate }}</mat-label>
              <input matInput type="number" [(ngModel)]="formData.medicineId" name="medicineId" required
                     [placeholder]="'temperature.placeholders.medicineId' | translate">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'temperature.temperature' | translate }}</mat-label>
              <input matInput type="number" step="0.1" [(ngModel)]="formData.temperature" name="temperature" required
                     [placeholder]="'temperature.placeholders.temperature' | translate">
              <mat-icon matSuffix>thermostat</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'temperature.state' | translate }}</mat-label>
              <input matInput [(ngModel)]="formData.state" name="state" required
                     [placeholder]="'temperature.placeholders.state' | translate">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'temperature.stock' | translate }}</mat-label>
              <input matInput type="number" [(ngModel)]="formData.stock" name="stock" required
                     [placeholder]="'temperature.placeholders.stock' | translate">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'temperature.location' | translate }}</mat-label>
              <input matInput [(ngModel)]="formData.location" name="location" required
                     [placeholder]="'temperature.placeholders.location' | translate">
            </mat-form-field>
          </form>
        </mat-card-content>

        <mat-card-actions class="form-actions">
          <button mat-button (click)="onClose()">
            <mat-icon>cancel</mat-icon>
            {{ 'common.cancel' | translate }}
          </button>
          <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="loading">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            <mat-icon *ngIf="!loading">update</mat-icon>
            {{ 'common.update' | translate }}
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styleUrls: ['./temperature-form.component.css']
})
export class TemperatureFormComponent implements OnInit {
  @Input() medicine: TemperatureMedicine | null = null;
  @Input() loading: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<TemperatureFormData>();

  formData: TemperatureFormData = {
    medicineId: 0,
    temperature: null,
    state: '',
    stock: null,
    location: ''
  };

  ngOnInit(): void {
    if (this.medicine) {
      this.formData = {
        medicineId: this.medicine.medicine?.id ?? 0,
        temperature: this.medicine.temperature,
        state: this.medicine.state,
        stock: this.medicine.stock,
        location: this.medicine.location
      };
    }
  }

  onSubmit(): void {
    if (!this.formData.medicineId || this.formData.temperature === null || this.formData.stock === null || !this.formData.state || !this.formData.location) {
      return;
    }
    this.submit.emit(this.formData);
  }

  onClose(): void {
    this.close.emit();
  }
}
