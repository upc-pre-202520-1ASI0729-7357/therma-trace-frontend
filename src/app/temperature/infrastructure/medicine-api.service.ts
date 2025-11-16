import { Injectable } from '@angular/core';
import { TemperatureMedicine, CreateTemperatureMedicineRequest, UpdateTemperatureMedicineRequest } from '../domain/model/medicine.entity';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemperatureMedicineApiService {
  private readonly API_URL = `${environment.apiUrl}/medicine-monitoring`;

  constructor(private http: HttpClient) {}

  async getTemperatureMedicines(): Promise<TemperatureMedicine[]> {
    const data = await firstValueFrom(this.http.get<any[]>(this.API_URL));

    return data.map((item: any) => ({
      id: Number(item.id),
      temperature: typeof item.temperature === 'string' ? parseFloat(item.temperature) : Number(item.temperature),
      state: item.state ?? '',
      stock: Number(item.stock ?? 0),
      location: item.location ?? '',
      medicine: {
        id: Number(item.medicine?.id ?? 0),
        name: item.medicine?.name ?? '',
        expirationDate: item.medicine?.expirationDate ?? '',
        image: item.medicine?.image ?? ''
      }
    }));
  }

  async createTemperatureMedicine(medicine: CreateTemperatureMedicineRequest): Promise<TemperatureMedicine> {
    const item = await firstValueFrom(this.http.post<any>(this.API_URL, {
      medicineId: medicine.medicineId,
      temperature: medicine.temperature,
      state: medicine.state,
      stock: medicine.stock,
      location: medicine.location
    }));

    return {
      id: Number(item.id),
      temperature: typeof item.temperature === 'string' ? parseFloat(item.temperature) : Number(item.temperature),
      state: item.state ?? '',
      stock: Number(item.stock ?? 0),
      location: item.location ?? '',
      medicine: {
        id: Number(item.medicine?.id ?? 0),
        name: item.medicine?.name ?? '',
        expirationDate: item.medicine?.expirationDate ?? '',
        image: item.medicine?.image ?? ''
      }
    };
  }

  async updateTemperatureMedicine(medicine: UpdateTemperatureMedicineRequest): Promise<TemperatureMedicine> {
    const item = await firstValueFrom(this.http.put<any>(`${this.API_URL}/${medicine.id}`, {
      medicineId: medicine.medicineId,
      temperature: medicine.temperature,
      state: medicine.state,
      stock: medicine.stock,
      location: medicine.location
    }));

    return {
      id: Number(item.id),
      temperature: typeof item.temperature === 'string' ? parseFloat(item.temperature) : Number(item.temperature),
      state: item.state ?? '',
      stock: Number(item.stock ?? 0),
      location: item.location ?? '',
      medicine: {
        id: Number(item.medicine?.id ?? 0),
        name: item.medicine?.name ?? '',
        expirationDate: item.medicine?.expirationDate ?? '',
        image: item.medicine?.image ?? ''
      }
    };
  }

  async deleteTemperatureMedicine(id: number): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.API_URL}/${id}`));
  }
}
