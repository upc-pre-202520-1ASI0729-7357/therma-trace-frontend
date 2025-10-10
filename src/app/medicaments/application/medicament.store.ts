import { Injectable, signal, computed } from '@angular/core';
import { Medicament, CreateMedicamentRequest, UpdateMedicamentRequest } from '../domain/model/medicament.entity';
import { MedicamentApiService } from '../infrastructure/medicament-api.service';

@Injectable({
  providedIn: 'root'
})
export class MedicamentStore {
  private medicamentsSignal = signal<Medicament[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string>('');
  private searchQuerySignal = signal<string>('');

  medicaments = this.medicamentsSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();
  searchQuery = this.searchQuerySignal.asReadonly();

  // Computed para medicamentos filtrados
  filteredMedicaments = computed(() => {
    const query = this.searchQuerySignal().toLowerCase();
    return this.medicamentsSignal().filter(medicament =>
      medicament.name.toLowerCase().includes(query)
    );
  });

  constructor(private medicamentApiService: MedicamentApiService) {}

  async loadMedicaments(): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set('');

    try {
      const medicaments = await this.medicamentApiService.getMedicaments();
      this.medicamentsSignal.set(medicaments);
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'Error loading medicaments');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async createMedicament(medicament: CreateMedicamentRequest): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set('');

    try {
      const newMedicament = await this.medicamentApiService.createMedicament(medicament);
      this.medicamentsSignal.update(medicaments => [...medicaments, newMedicament]);
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'Error creating medicament');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async updateMedicament(medicament: UpdateMedicamentRequest): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set('');

    try {
      const updatedMedicament = await this.medicamentApiService.updateMedicament(medicament);
      this.medicamentsSignal.update(medicaments =>
        medicaments.map(m => m.id === updatedMedicament.id ? updatedMedicament : m)
      );
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'Error updating medicament');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async deleteMedicament(id: number): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set('');

    try {
      await this.medicamentApiService.deleteMedicament(id);
      this.medicamentsSignal.update(medicaments => medicaments.filter(m => m.id !== id));
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'Error deleting medicament');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  setSearchQuery(query: string): void {
    this.searchQuerySignal.set(query);
  }

  isExpired(dateStr: string): boolean {
    const today = new Date();
    const expirationDate = new Date(dateStr);
    return expirationDate < today;
  }
}
