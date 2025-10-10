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
  name: string;
  temperature: string;
  expirationDate: string;
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
              <mat-label>{{ 'temperature.medicineName' | translate }}</mat-label>
              <input matInput [(ngModel)]="formData.name" name="name" required
                     [placeholder]="'temperature.placeholders.medicineName' | translate">
              <mat-icon matSuffix>medication</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'temperature.temperature' | translate }}</mat-label>
              <input matInput [(ngModel)]="formData.temperature" name="temperature" required
                     [placeholder]="'temperature.placeholders.temperature' | translate">
              <mat-icon matSuffix>thermostat</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'temperature.expirationDate' | translate }}</mat-label>
              <input matInput type="date" [(ngModel)]="formData.expirationDate" name="expirationDate" required>
              <mat-icon matSuffix>event</mat-icon>
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
    name: '',
    temperature: '',
    expirationDate: ''
  };

  ngOnInit(): void {
    if (this.medicine) {
      this.formData = {
        name: this.medicine.name,
        temperature: this.medicine.temperature,
        expirationDate: this.medicine.expirationDate
      };
    }
  }

  onSubmit(): void {
    if (!this.formData.name || !this.formData.temperature || !this.formData.expirationDate) {
      return;
    }
    this.submit.emit(this.formData);
  }

  onClose(): void {
    this.close.emit();
  }
}
