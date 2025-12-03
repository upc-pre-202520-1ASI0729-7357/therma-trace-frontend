import { Component, Output, EventEmitter, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudinaryService } from '../../../services/cloudinary.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

/**
 * Image Upload Component
 * Allows users to upload images to Cloudinary
 */
@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="image-upload-container">
      <!-- Preview of current image -->
      @if (imageUrl()) {
        <div class="image-preview">
          <img [src]="imageUrl()" [alt]="altText()" />
          @if (!disabled()) {
            <button
              mat-icon-button
              class="remove-button"
              (click)="removeImage()"
              [disabled]="uploading()">
              <mat-icon>close</mat-icon>
            </button>
          }
        </div>
      }

      <!-- Upload button -->
      @if (!imageUrl() || allowMultiple()) {
        <div class="upload-section">
          <input
            #fileInput
            type="file"
            accept="image/*"
            (change)="onFileSelected($event)"
            [disabled]="disabled() || uploading()"
            style="display: none"
          />

          <button
            mat-raised-button
            color="primary"
            (click)="fileInput.click()"
            [disabled]="disabled() || uploading()">
            @if (uploading()) {
              <ng-container>
                <mat-spinner diameter="20"></mat-spinner>
                <span>Subiendo...</span>
              </ng-container>
            } @else {
              <ng-container>
                <mat-icon>cloud_upload</mat-icon>
                <span>{{ buttonText() }}</span>
              </ng-container>
            }
          </button>

          @if (showHint()) {
            <p class="upload-hint">{{ hintText() }}</p>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .image-upload-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }

    .image-preview {
      position: relative;
      max-width: 300px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .image-preview img {
      width: 100%;
      height: auto;
      display: block;
    }

    .remove-button {
      position: absolute;
      top: 8px;
      right: 8px;
      background-color: rgba(0, 0, 0, 0.6);
      color: white;
    }

    .remove-button:hover {
      background-color: rgba(0, 0, 0, 0.8);
    }

    .upload-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .upload-section button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .upload-hint {
      margin: 0;
      font-size: 0.875rem;
      color: #666;
      text-align: center;
    }

    mat-spinner {
      display: inline-block;
      margin-right: 8px;
    }
  `]
})
export class ImageUploadComponent {
  // Inputs
  imageUrl = input<string>('');
  buttonText = input<string>('Subir Imagen');
  hintText = input<string>('Formatos: JPG, PNG, GIF, WebP (Máx. 10MB)');
  showHint = input<boolean>(true);
  disabled = input<boolean>(false);
  allowMultiple = input<boolean>(false);
  altText = input<string>('Imagen subida');
  maxSizeInMB = input<number>(10);

  // Outputs
  @Output() imageUploaded = new EventEmitter<string>();
  @Output() imageRemoved = new EventEmitter<void>();
  @Output() uploadError = new EventEmitter<string>();

  // State
  uploading = signal<boolean>(false);

  constructor(
    private cloudinaryService: CloudinaryService,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Handle file selection
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    // Validate file
    const validation = this.cloudinaryService.validateFile(file, this.maxSizeInMB());
    if (!validation.valid) {
      this.showError(validation.error || 'Archivo inválido');
      this.uploadError.emit(validation.error);
      input.value = ''; // Reset input
      return;
    }

    // Upload file
    this.uploadFile(file);
    input.value = ''; // Reset input
  }

  /**
   * Upload file to Cloudinary
   */
  private uploadFile(file: File): void {
    this.uploading.set(true);

    this.cloudinaryService.uploadImage(file).subscribe({
      next: (url) => {
        this.uploading.set(false);
        this.imageUploaded.emit(url);
        this.showSuccess('Imagen subida exitosamente');
      },
      error: (error) => {
        this.uploading.set(false);
        const errorMessage = 'Error al subir la imagen';
        this.showError(errorMessage);
        this.uploadError.emit(errorMessage);
        console.error('Upload error:', error);
      }
    });
  }

  /**
   * Remove the current image
   */
  removeImage(): void {
    this.imageRemoved.emit();
  }

  /**
   * Show success message
   */
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Show error message
   */
  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}

