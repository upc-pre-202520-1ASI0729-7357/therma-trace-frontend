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
          <!-- Medicine Name Column -->
          <ng-container matColumnDef="medicineName">
            <th mat-header-cell *matHeaderCellDef>
              <mat-icon class="header-icon">medication</mat-icon>
              {{ 'temperature.medicineName' | translate }}
            </th>
            <td mat-cell *matCellDef="let medicine">{{ medicine.medicine?.name }}</td>
          </ng-container>

          <!-- Temperature Column -->
          <ng-container matColumnDef="temperature">
            <th mat-header-cell *matHeaderCellDef>
              <mat-icon class="header-icon">thermostat</mat-icon>
              {{ 'temperature.temperature' | translate }}
            </th>
            <td mat-cell *matCellDef="let medicine">{{ medicine.temperature }}</td>
          </ng-container>

          <!-- State Column -->
          <ng-container matColumnDef="state">
            <th mat-header-cell *matHeaderCellDef>
              <mat-icon class="header-icon">info</mat-icon>
              {{ 'temperature.state' | translate }}
            </th>
            <td mat-cell *matCellDef="let medicine">
              <mat-icon class="cell-icon" aria-hidden="true">info</mat-icon>
              {{ medicine.state }}
            </td>
          </ng-container>

          <!-- Stock Column -->
          <ng-container matColumnDef="stock">
            <th mat-header-cell *matHeaderCellDef>
              <mat-icon class="header-icon">inventory</mat-icon>
              {{ 'temperature.stock' | translate }}
            </th>
            <td mat-cell *matCellDef="let medicine">
              <mat-icon class="cell-icon" aria-hidden="true">inventory</mat-icon>
              {{ medicine.stock }}</td>
          </ng-container>

          <!-- Location Column -->
          <ng-container matColumnDef="location">
            <th mat-header-cell *matHeaderCellDef>
              <mat-icon class="header-icon">place</mat-icon>
              {{ 'temperature.location' | translate }}
            </th>
            <td mat-cell *matCellDef="let medicine">
              <mat-icon class="cell-icon" aria-hidden="true">place</mat-icon>
              {{ medicine.location }}</td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>
              <mat-icon class="header-icon">more_horiz</mat-icon>
              {{ 'temperature.actions' | translate }}
            </th>
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
          <tr mat-row *matRowDef="let _; columns: displayedColumns"></tr>
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

  displayedColumns: string[] = ['medicineName', 'temperature', 'state', 'stock', 'location', 'actions'];

  onEdit(medicine: TemperatureMedicine): void {
    this.edit.emit(medicine);
  }

  onDelete(medicine: TemperatureMedicine): void {
    this.delete.emit(medicine);
  }
}
