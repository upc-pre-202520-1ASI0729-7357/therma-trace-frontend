import { Injectable } from '@angular/core';
import { TemperatureMedicine, CreateTemperatureMedicineRequest, UpdateTemperatureMedicineRequest } from '../domain/model/medicine.entity';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemperatureMedicineApiService {
  private readonly API_URL = `${environment.apiUrl}/medicines`;

  async getTemperatureMedicines(): Promise<TemperatureMedicine[]> {
    const response = await fetch(this.API_URL);
    if (!response.ok) {
      throw new Error('Error fetching temperature medicines');
    }
    return response.json();
  }

  async createTemperatureMedicine(medicine: CreateTemperatureMedicineRequest): Promise<TemperatureMedicine> {
    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medicine),
    });
    if (!response.ok) {
      throw new Error('Error creating temperature medicine');
    }
    return response.json();
  }

  async updateTemperatureMedicine(medicine: UpdateTemperatureMedicineRequest): Promise<TemperatureMedicine> {
    const response = await fetch(`${this.API_URL}/${medicine.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medicine),
    });
    if (!response.ok) {
      throw new Error('Error updating temperature medicine');
    }
    return response.json();
  }

  async deleteTemperatureMedicine(id: number): Promise<void> {
    const response = await fetch(`${this.API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error deleting temperature medicine');
    }
  }
}
