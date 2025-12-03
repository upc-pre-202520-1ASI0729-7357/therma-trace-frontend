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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Medicament } from '../../../domain/model/medicament.entity';
import { CloudinaryService } from '../../../../shared/services/cloudinary.service';

export interface MedicamentFormData {
  name: string;
  expirationDate: Date | null;
  imageUrl: string;
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
    MatSnackBarModule,
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
                        [matTooltip]="'medicaments.selectImage' | translate"
                        [disabled]="uploadingImage">
                  <mat-icon>upload_file</mat-icon>
                </button>
              </mat-form-field>

              <input #fileInput type="file" accept="image/*" (change)="onImageSelected($event)"
                     style="display: none;" [disabled]="uploadingImage">

              <!-- Estado de subida -->
              <div *ngIf="uploadingImage" class="upload-status">
                <mat-spinner diameter="24"></mat-spinner>
                <span>{{ 'medicaments.uploadingImage' | translate }}</span>
              </div>

              <!-- Preview de la imagen -->
              <div *ngIf="imagePreview" class="image-preview-container">
                <img [src]="imagePreview" alt="Preview" class="image-preview">
                <button mat-icon-button type="button" (click)="removeImage()"
                        class="remove-image-btn" [matTooltip]="'common.remove' | translate"
                        [disabled]="uploadingImage">
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
          <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="loading || uploadingImage">
            <mat-spinner *ngIf="loading || uploadingImage" diameter="20"></mat-spinner>
            <mat-icon *ngIf="!loading && !uploadingImage">{{ isEditing ? 'update' : 'save' }}</mat-icon>
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
    expirationDate: null,
    imageUrl: ''
  };

  imagePreview: string | null = null;
  selectedFileName: string = '';
  uploadingImage: boolean = false;

  constructor(
    private cloudinaryService: CloudinaryService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

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
      expirationDate: expirationDate,
      imageUrl: this.medicament.imageUrl || (this.medicament as any).image || ''
    };

    // Configurar preview si hay una imagen existente
    const existingImage = this.medicament.imageUrl || (this.medicament as any).image;
    if (existingImage && existingImage !== 'https://via.placeholder.com/300x200?text=Medicine') {
      this.imagePreview = existingImage;
      this.selectedFileName = 'Imagen actual';
    } else {
      this.imagePreview = null;
      this.selectedFileName = '';
    }
  }

  private resetForm(): void {
    this.formData = {
      name: '',
      expirationDate: null,
      imageUrl: ''
    };
    this.imagePreview = null;
    this.selectedFileName = '';
  }

  onImageSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      const file = element.files[0];

      // Validar archivo usando el servicio de Cloudinary
      const validation = this.cloudinaryService.validateFile(file, 10);
      if (!validation.valid) {
        this.showError(validation.error || this.translate.instant('medicaments.invalidFile'));
        this.imageValidationError.emit(validation.error);
        element.value = ''; // Reset input
        return;
      }

      this.selectedFileName = file.name;

      // Crear preview local inmediatamente
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          this.imagePreview = result;
        }
      };
      reader.readAsDataURL(file);

      // Subir a Cloudinary
      this.uploadingImage = true;
      this.cloudinaryService.uploadImage(file).subscribe({
        next: (url) => {
          this.uploadingImage = false;
          this.formData.imageUrl = url; // Guardar la URL de Cloudinary
          console.log('Cloudinary URL:', url);
        },
        error: (error) => {
          this.uploadingImage = false;
          this.showError(this.translate.instant('medicaments.imageUploadError'));
          this.imageValidationError.emit('Error uploading to Cloudinary');
          console.error('Cloudinary upload error:', error);
          // Limpiar preview en caso de error
          this.imagePreview = null;
          this.selectedFileName = '';
          this.formData.imageUrl = '';
        }
      });

      element.value = ''; // Reset input
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedFileName = '';
    this.formData.imageUrl = '';
  }

  onSubmit(): void {
    if (!this.formData.name || !this.formData.expirationDate) {
      return;
    }
    this.submit.emit(this.formData);
  }

  onClose(): void {
    this.close.emit();
  }

  private showError(message: string): void {
    this.snackBar.open(message, this.translate.instant('common.close'), {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
