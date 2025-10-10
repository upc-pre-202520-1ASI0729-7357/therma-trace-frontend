import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Medicament } from '../../../domain/model/medicament.entity';

export interface MedicamentFormData {
  name: string;
  temperature: string;
  expirationDate: Date | null;
  image: string;
}

@Component({
  selector: 'app-medicament-form',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    TranslateModule
  ],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <mat-card class="modal-content" (click)="$event.stopPropagation()">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>{{ isEditing ? 'edit' : 'add' }}</mat-icon>
            {{ isEditing ? ('medicaments.editMedicament' | translate) : ('medicaments.addNewMedicament' | translate) }}
          </mat-card-title>
          <button mat-icon-button (click)="onClose()" class="close-btn">
            <mat-icon>close</mat-icon>
          </button>
        </mat-card-header>

        <mat-card-content>
          <form (ngSubmit)="onSubmit()" class="medicament-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'medicaments.name' | translate }}</mat-label>
              <input matInput [(ngModel)]="formData.name" name="name" required
                     [placeholder]="'medicaments.placeholders.name' | translate">
              <mat-icon matSuffix>medication</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'medicaments.temperature' | translate }}</mat-label>
              <input matInput [(ngModel)]="formData.temperature" name="temperature" required
                     [placeholder]="'medicaments.placeholders.temperature' | translate">
              <mat-icon matSuffix>thermostat</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'medicaments.expirationDate' | translate }}</mat-label>
              <input matInput [matDatepicker]="picker" [(ngModel)]="formData.expirationDate"
                     name="expirationDate" required readonly>
              <mat-hint>{{ 'medicaments.selectDateHint' | translate }}</mat-hint>
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <!-- Selector de imagen -->
            <div class="image-upload-section">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>{{ 'medicaments.image' | translate }}</mat-label>
                <input matInput type="text" readonly [value]="selectedFileName"
                       [placeholder]="'medicaments.placeholders.selectImage' | translate">
                <button mat-icon-button matSuffix type="button" (click)="fileInput.click()"
                        [matTooltip]="'medicaments.selectImage' | translate">
                  <mat-icon>upload_file</mat-icon>
                </button>
              </mat-form-field>

              <input #fileInput type="file" accept="image/*" (change)="onImageSelected($event)"
                     style="display: none;">

              <!-- Preview de la imagen -->
              <div *ngIf="imagePreview" class="image-preview-container">
                <img [src]="imagePreview" alt="Preview" class="image-preview">
                <button mat-icon-button type="button" (click)="removeImage()"
                        class="remove-image-btn" [matTooltip]="'common.remove' | translate">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
            </div>
          </form>
        </mat-card-content>

        <mat-card-actions class="form-actions">
          <button mat-button (click)="onClose()">
            <mat-icon>cancel</mat-icon>
            {{ 'common.cancel' | translate }}
          </button>
          <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="loading">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            <mat-icon *ngIf="!loading">{{ isEditing ? 'update' : 'save' }}</mat-icon>
            {{ isEditing ? ('common.update' | translate) : ('common.create' | translate) }}
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styleUrls: ['./medicament-form.component.css']
})
export class MedicamentFormComponent implements OnInit {
  @Input() isEditing: boolean = false;
  @Input() medicament: Medicament | null = null;
  @Input() loading: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<MedicamentFormData>();
  @Output() imageValidationError = new EventEmitter<string>();

  formData: MedicamentFormData = {
    name: '',
    temperature: '',
    expirationDate: null,
    image: ''
  };

  imagePreview: string | null = null;
  selectedFileName: string = '';

  ngOnInit(): void {
    if (this.isEditing && this.medicament) {
      this.loadMedicamentData();
    } else {
      this.resetForm();
    }
  }

  private loadMedicamentData(): void {
    if (!this.medicament) return;

    const expirationDate = this.medicament.expirationDate ? new Date(this.medicament.expirationDate) : null;
    this.formData = {
      name: this.medicament.name,
      temperature: this.medicament.temperature,
      expirationDate: expirationDate,
      image: this.medicament.image
    };

    // Configurar preview si hay una imagen existente
    if (this.medicament.image && this.medicament.image !== 'https://via.placeholder.com/300x200?text=Medicine') {
      this.imagePreview = this.medicament.image;
      this.selectedFileName = 'Imagen actual';
    } else {
      this.imagePreview = null;
      this.selectedFileName = '';
    }
  }

  private resetForm(): void {
    this.formData = {
      name: '',
      temperature: '',
      expirationDate: null,
      image: ''
    };
    this.imagePreview = null;
    this.selectedFileName = '';
  }

  onImageSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      const file = element.files[0];

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.imageValidationError.emit('medicaments.invalidFileType');
        return;
      }

      // Validar tamaño de archivo (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.imageValidationError.emit('medicaments.fileTooLarge');
        return;
      }

      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          this.imagePreview = result;
          this.formData.image = result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedFileName = '';
    this.formData.image = '';
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
