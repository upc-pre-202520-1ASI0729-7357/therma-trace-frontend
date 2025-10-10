import { Injectable } from '@angular/core';
import { Medicament, CreateMedicamentRequest, UpdateMedicamentRequest } from '../domain/model/medicament.entity';

@Injectable({
  providedIn: 'root'
})
export class MedicamentApiService {
  private readonly API_URL = 'http://localhost:3000/medicines';

  async getMedicaments(): Promise<Medicament[]> {
    const response = await fetch(this.API_URL);
    if (!response.ok) {
      throw new Error('Error fetching medicaments');
    }
    return response.json();
  }

  async createMedicament(medicament: CreateMedicamentRequest): Promise<Medicament> {
    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medicament),
    });
    if (!response.ok) {
      throw new Error('Error creating medicament');
    }
    return response.json();
  }

  async updateMedicament(medicament: UpdateMedicamentRequest): Promise<Medicament> {
    const response = await fetch(`${this.API_URL}/${medicament.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medicament),
    });
    if (!response.ok) {
      throw new Error('Error updating medicament');
    }
    return response.json();
  }

  async deleteMedicament(id: number): Promise<void> {
    const response = await fetch(`${this.API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error deleting medicament');
    }
  }
}
