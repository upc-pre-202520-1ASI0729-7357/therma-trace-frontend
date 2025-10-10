import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { TemperatureMedicine } from '../../../domain/model/medicine.entity';

@Component({
  selector: 'app-temperature-table',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule
  ],
  template: `
    <mat-card class="table-card" appearance="outlined">
      <mat-card-header>
        <mat-card-title>{{ 'temperature.medicineList' | translate }}</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <table mat-table [dataSource]="medicines" class="medicines-table">
          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>
              <mat-icon class="header-icon">medication</mat-icon>
              {{ 'temperature.medicineName' | translate }}
            </th>
            <td mat-cell *matCellDef="let medicine">{{ medicine.name }}</td>
          </ng-container>

          <!-- Temperature Column -->
          <ng-container matColumnDef="temperature">
            <th mat-header-cell *matHeaderCellDef>
              <mat-icon class="header-icon">thermostat</mat-icon>
              {{ 'temperature.temperature' | translate }}
            </th>
            <td mat-cell *matCellDef="let medicine">{{ medicine.temperature }}</td>
          </ng-container>

          <!-- Expiration Date Column -->
          <ng-container matColumnDef="expirationDate">
            <th mat-header-cell *matHeaderCellDef>
              <mat-icon class="header-icon">event</mat-icon>
              {{ 'temperature.expirationDate' | translate }}
            </th>
            <td mat-cell *matCellDef="let medicine">{{ medicine.expirationDate }}</td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>{{ 'temperature.actions' | translate }}</th>
            <td mat-cell *matCellDef="let medicine">
              <button mat-icon-button color="primary"
                      (click)="onEdit(medicine)"
                      [matTooltip]="'common.edit' | translate">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn"
                      (click)="onDelete(medicine)"
                      [matTooltip]="'common.delete' | translate">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./temperature-table.component.css']
})
export class TemperatureTableComponent {
  @Input() medicines: TemperatureMedicine[] = [];
  @Output() edit = new EventEmitter<TemperatureMedicine>();
  @Output() delete = new EventEmitter<TemperatureMedicine>();

  displayedColumns: string[] = ['name', 'temperature', 'expirationDate', 'actions'];

  onEdit(medicine: TemperatureMedicine): void {
    this.edit.emit(medicine);
  }

  onDelete(medicine: TemperatureMedicine): void {
    this.delete.emit(medicine);
  }
}
