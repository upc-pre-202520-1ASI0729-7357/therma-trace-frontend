import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TemperatureMedicineStore } from '../../application/medicine.store';
import { TemperatureMedicine, UpdateTemperatureMedicineRequest } from '../../domain/model/medicine.entity';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/presentation/components/confirm-dialog/confirm-dialog.component';

// Import new components
import { TemperatureToolbarComponent } from '../components/temperature-toolbar/temperature-toolbar.component';
import { TemperatureTableComponent } from '../components/temperature-table/temperature-table.component';
import { TemperatureFormComponent, TemperatureFormData } from '../components/temperature-form/temperature-form.component';
import { LoadingStateComponent } from '../../../shared/presentation/components/loading-state/loading-state.component';
import { ErrorStateComponent } from '../../../shared/presentation/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../../shared/presentation/components/empty-state/empty-state.component';

@Component({
  selector: 'app-temperature-management',
  standalone: true,
  imports: [
    CommonModule,
    TemperatureToolbarComponent,
    TemperatureTableComponent,
    TemperatureFormComponent,
    LoadingStateComponent,
    ErrorStateComponent,
    EmptyStateComponent
  ],
  templateUrl: './medicine-management.html',
  styleUrls: ['./medicine-management.css']
})
export class TemperatureManagement implements OnInit {
  showForm = false;
  editingMedicine: TemperatureMedicine | null = null;

  private translate = inject(TranslateService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  constructor(public temperatureMedicineStore: TemperatureMedicineStore) {}

  ngOnInit() {
    this.temperatureMedicineStore.loadTemperatureMedicines();
  }

  openEditForm(medicine: TemperatureMedicine) {
    this.editingMedicine = medicine;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingMedicine = null;
  }

  async onSubmit(formData: TemperatureFormData) {
    if (!this.editingMedicine) return;

    // Validate required fields
    if (!formData.medicineId || formData.temperature === null || formData.stock === null || !formData.state || !formData.location) {
      this.snackBar.open(
        this.translate.instant('common.error') + ': ' + this.translate.instant('temperature.fillAllFields'),
        this.translate.instant('common.close'),
        { duration: 3000 }
      );
      return;
    }

    try {
      const updateRequest: UpdateTemperatureMedicineRequest = {
        id: this.editingMedicine.id,
        medicineId: formData.medicineId,
        temperature: Number(formData.temperature),
        state: formData.state,
        stock: Number(formData.stock),
        location: formData.location
      };

      await this.temperatureMedicineStore.updateTemperatureMedicine(updateRequest);
      this.snackBar.open(
        this.translate.instant('temperature.updateSuccess'),
        this.translate.instant('common.close'),
        { duration: 3000 }
      );
      this.closeForm();
    } catch (error) {
      console.error('Error updating medicine:', error);
      this.snackBar.open(
        this.translate.instant('common.error'),
        this.translate.instant('common.close'),
        { duration: 5000 }
      );
    }
  }

  async deleteMedicine(medicine: TemperatureMedicine) {
    const dialogData: ConfirmDialogData = {
      title: this.translate.instant('temperature.deleteConfirmTitle'),
      message: this.translate.instant('temperature.deleteConfirm', { name: medicine.medicine?.name ?? '' }),
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
        await this.temperatureMedicineStore.deleteTemperatureMedicine(medicine.id);
        this.snackBar.open(
          this.translate.instant('temperature.deleteSuccess'),
          this.translate.instant('common.close'),
          { duration: 3000 }
        );
      } catch (error) {
        console.error('Error deleting medicine:', error);
        this.snackBar.open(
          this.translate.instant('common.error'),
          this.translate.instant('common.close'),
          { duration: 5000 }
        );
      }
    }
  }
}
