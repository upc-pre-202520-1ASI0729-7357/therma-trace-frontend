import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicamentCardComponent } from '../medicament-card/medicament-card.component';
import { Medicament } from '../../../domain/model/medicament.entity';

@Component({
  selector: 'app-medicament-grid',
  standalone: true,
  imports: [
    CommonModule,
    MedicamentCardComponent
  ],
  template: `
    <div class="medicaments-grid">
      <app-medicament-card
        *ngFor="let medicament of medicaments"
        [medicament]="medicament"
        [isExpired]="isExpiredFn(medicament.expirationDate)"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)">
      </app-medicament-card>
    </div>
  `,
  styles: [`
    .medicaments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
      padding: 0 24px 24px;
    }

    @media (max-width: 768px) {
      .medicaments-grid {
        grid-template-columns: 1fr;
        padding: 0 16px 16px;
      }
    }
  `]
})
export class MedicamentGridComponent {
  @Input() medicaments: Medicament[] = [];
  @Input() isExpiredFn!: (dateStr: string) => boolean;
  @Output() edit = new EventEmitter<Medicament>();
  @Output() delete = new EventEmitter<Medicament>();

  onEdit(medicament: Medicament): void {
    this.edit.emit(medicament);
  }

  onDelete(medicament: Medicament): void {
    this.delete.emit(medicament);
  }
}
