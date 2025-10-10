import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-medicament-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule
  ],
  template: `
    <mat-toolbar class="header-toolbar" color="primary">
      <span class="title-with-icon">
        <mat-icon>medication</mat-icon>
        {{ 'medicaments.title' | translate }}
      </span>
      <span class="spacer"></span>
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>{{ 'medicaments.searchPlaceholder' | translate }}</mat-label>
        <input matInput (input)="onSearchChange($event)" />
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>
      <button mat-raised-button color="accent" class="add-btn" (click)="onAddClick()">
        <mat-icon>add</mat-icon>
        {{ 'medicaments.addMedicament' | translate }}
      </button>
    </mat-toolbar>
  `,
  styleUrls: ['./medicament-toolbar.component.css']
})
export class MedicamentToolbarComponent {
  @Output() searchChange = new EventEmitter<string>();
  @Output() addClick = new EventEmitter<void>();

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchChange.emit(target.value);
  }

  onAddClick(): void {
    this.addClick.emit();
  }
}
