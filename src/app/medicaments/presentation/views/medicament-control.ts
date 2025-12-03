import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MedicamentStore } from '../../application/medicament.store';
import { Medicament, CreateMedicamentRequest, UpdateMedicamentRequest } from '../../domain/model/medicament.entity';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/presentation/components/confirm-dialog/confirm-dialog.component';

// Import new components
import { MedicamentToolbarComponent } from '../components/medicament-toolbar/medicament-toolbar.component';
import { MedicamentGridComponent } from '../components/medicament-grid/medicament-grid.component';
import { MedicamentFormComponent, MedicamentFormData } from '../components/medicament-form/medicament-form.component';
import { LoadingStateComponent } from '../../../shared/presentation/components/loading-state/loading-state.component';
import { ErrorStateComponent } from '../../../shared/presentation/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../../shared/presentation/components/empty-state/empty-state.component';

@Component({
  selector: 'app-medicament-control',
  standalone: true,
  imports: [
    CommonModule,
    MedicamentToolbarComponent,
    MedicamentGridComponent,
    MedicamentFormComponent,
    LoadingStateComponent,
    ErrorStateComponent,
    EmptyStateComponent
  ],
  templateUrl: './medicament-control.html',
  styleUrls: ['./medicament-control.css']
})
export class MedicamentControl implements OnInit {
  showForm = false;
  editingMedicament: Medicament | null = null;

  private translate = inject(TranslateService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor(public medicamentStore: MedicamentStore) {}

  ngOnInit() {
    this.medicamentStore.loadMedicaments();
  }

  onSearchChange(query: string) {
    this.medicamentStore.setSearchQuery(query);
  }

  openCreateForm() {
    this.editingMedicament = null;
    this.showForm = true;
  }

  openEditForm(medicament: Medicament) {
    this.editingMedicament = medicament;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingMedicament = null;
  }

  async onSubmit(formData: MedicamentFormData) {
    if (!formData.name || !formData.expirationDate) {
      this.snackBar.open(
        this.translate.instant('common.error') + ': ' + this.translate.instant('medicaments.fillAllFields'),
        this.translate.instant('common.close'),
        { duration: 3000 }
      );
      return;
    }

    // Convert Date to string in YYYY-MM-DD format
    const formatDate = (date: Date): string => {
      return date.toISOString().split('T')[0];
    };

    try {
      if (this.editingMedicament) {
        const updateRequest: UpdateMedicamentRequest = {
          id: this.editingMedicament.id,
          name: formData.name,
          expirationDate: formatDate(formData.expirationDate),
          imageUrl: formData.imageUrl || 'https://via.placeholder.com/300x200?text=Medicine'
        };
        await this.medicamentStore.updateMedicament(updateRequest);
        this.snackBar.open(
          this.translate.instant('medicaments.updateSuccess'),
          this.translate.instant('common.close'),
          { duration: 3000 }
        );
      } else {
        const createRequest: CreateMedicamentRequest = {
          name: formData.name,
          expirationDate: formatDate(formData.expirationDate),
          imageUrl: formData.imageUrl || 'https://via.placeholder.com/300x200?text=Medicine'
        };
        await this.medicamentStore.createMedicament(createRequest);
        this.snackBar.open(
          this.translate.instant('medicaments.createSuccess'),
          this.translate.instant('common.close'),
          { duration: 3000 }
        );
      }
      this.closeForm();
    } catch (error) {
      console.error('Error saving medicament:', error);
      this.snackBar.open(
        this.translate.instant('common.error'),
        this.translate.instant('common.close'),
        { duration: 5000 }
      );
    }
  }

  onImageValidationError(errorKey: string) {
    this.snackBar.open(
      this.translate.instant(errorKey),
      this.translate.instant('common.close'),
      { duration: 3000 }
    );
  }

  async deleteMedicament(medicament: Medicament) {
    const dialogData: ConfirmDialogData = {
      title: this.translate.instant('medicaments.deleteConfirmTitle'),
      message: this.translate.instant('medicaments.deleteConfirm', { name: medicament.name }),
      confirmText: this.translate.instant('common.delete'),
      cancelText: this.translate.instant('common.cancel'),
      icon: 'warning',
      confirmColor: 'warn'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      disableClose: true
    });

    const result = await dialogRef.afterClosed().toPromise();

    if (result) {
      try {
        await this.medicamentStore.deleteMedicament(medicament.id);
        this.snackBar.open(
          this.translate.instant('medicaments.deleteSuccess'),
          this.translate.instant('common.close'),
          { duration: 3000 }
        );
      } catch (error) {
        console.error('Error deleting medicament:', error);
        this.snackBar.open(
          this.translate.instant('common.error'),
          this.translate.instant('common.close'),
          { duration: 5000 }
        );
      }
    }
  }

  isExpired(dateStr: string): boolean {
    return this.medicamentStore.isExpired(dateStr);
  }
}
