import { Injectable, signal } from '@angular/core';
import { TemperatureMedicine, CreateTemperatureMedicineRequest, UpdateTemperatureMedicineRequest } from '../domain/model/medicine.entity';
import { TemperatureMedicineApiService } from '../infrastructure/medicine-api.service';

@Injectable({
  providedIn: 'root'
})
export class TemperatureMedicineStore {
  private temperatureMedicinesSignal = signal<TemperatureMedicine[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string>('');

  temperatureMedicines = this.temperatureMedicinesSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  constructor(private temperatureMedicineApiService: TemperatureMedicineApiService) {}

  async loadTemperatureMedicines(): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set('');

    try {
      const medicines = await this.temperatureMedicineApiService.getTemperatureMedicines();
      this.temperatureMedicinesSignal.set(medicines);
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'Error loading temperature medicines');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async createTemperatureMedicine(medicine: CreateTemperatureMedicineRequest): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set('');

    try {
      const newMedicine = await this.temperatureMedicineApiService.createTemperatureMedicine(medicine);
      this.temperatureMedicinesSignal.update(medicines => [...medicines, newMedicine]);
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'Error creating temperature medicine');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async updateTemperatureMedicine(medicine: UpdateTemperatureMedicineRequest): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set('');

    try {
      const updatedMedicine = await this.temperatureMedicineApiService.updateTemperatureMedicine(medicine);
      this.temperatureMedicinesSignal.update(medicines =>
        medicines.map(m => m.id === updatedMedicine.id ? updatedMedicine : m)
      );
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'Error updating temperature medicine');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async deleteTemperatureMedicine(id: number): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set('');

    try {
      await this.temperatureMedicineApiService.deleteTemperatureMedicine(id);
      this.temperatureMedicinesSignal.update(medicines => medicines.filter(m => m.id !== id));
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'Error deleting temperature medicine');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }
}
