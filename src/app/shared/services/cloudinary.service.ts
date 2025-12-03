import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * Response from Cloudinary upload
 */
export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  url: string;
  signature: string;
}

/**
 * Cloudinary Service
 * Handles image uploads to Cloudinary
 */
@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private readonly cloudName = environment.cloudinary.cloudName;
  private readonly uploadPreset = environment.cloudinary.uploadPreset;
  private readonly uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

  constructor(private http: HttpClient) {}

  /**
   * Upload an image file to Cloudinary
   * @param file - The file to upload
   * @returns Observable with the secure URL of the uploaded image
   */
  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    return this.http.post<CloudinaryUploadResponse>(this.uploadUrl, formData).pipe(
      map(response => response.secure_url),
      catchError(error => {
        console.error('Error uploading image to Cloudinary:', error);
        return throwError(() => new Error('Failed to upload image'));
      })
    );
  }

  /**
   * Upload an image from a base64 string
   * @param base64String - The base64 encoded image
   * @returns Observable with the secure URL of the uploaded image
   */
  uploadBase64Image(base64String: string): Observable<string> {
    const formData = new FormData();
    formData.append('file', base64String);
    formData.append('upload_preset', this.uploadPreset);

    return this.http.post<CloudinaryUploadResponse>(this.uploadUrl, formData).pipe(
      map(response => response.secure_url),
      catchError(error => {
        console.error('Error uploading base64 image to Cloudinary:', error);
        return throwError(() => new Error('Failed to upload image'));
      })
    );
  }

  /**
   * Upload multiple images
   * @param files - Array of files to upload
   * @returns Observable with array of secure URLs
   */
  uploadMultipleImages(files: File[]): Observable<string[]> {
    const uploadObservables = files.map(file => this.uploadImage(file));
    return from(Promise.all(uploadObservables.map(obs => obs.toPromise()))) as Observable<string[]>;
  }

  /**
   * Get full response from Cloudinary (includes more metadata)
   * @param file - The file to upload
   * @returns Observable with the full Cloudinary response
   */
  uploadImageWithMetadata(file: File): Observable<CloudinaryUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    return this.http.post<CloudinaryUploadResponse>(this.uploadUrl, formData).pipe(
      catchError(error => {
        console.error('Error uploading image to Cloudinary:', error);
        return throwError(() => new Error('Failed to upload image'));
      })
    );
  }

  /**
   * Validate file before upload
   * @param file - The file to validate
   * @param maxSizeInMB - Maximum file size in megabytes (default: 10MB)
   * @returns Object with validation result
   */
  validateFile(file: File, maxSizeInMB: number = 10): { valid: boolean; error?: string } {
    // Check if file exists
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Only JPEG, PNG, GIF and WebP are allowed' };
    }

    // Check file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return { valid: false, error: `File size exceeds ${maxSizeInMB}MB limit` };
    }

    return { valid: true };
  }
}

