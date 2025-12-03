import { Injectable } from '@angular/core';
import { TemperatureMedicine, CreateTemperatureMedicineRequest, UpdateTemperatureMedicineRequest } from '../domain/model/medicine.entity';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Add HttpHeaders
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemperatureMedicineApiService {
  private readonly API_URL = `${environment.apiUrl}/medicine-monitoring`;

  constructor(private http: HttpClient) {}


  private buildHeaders(contentType?: string) {
    if (contentType) {
      return { headers: new HttpHeaders({ 'Content-Type': contentType }) };
    }
    return {};
  }

  async getTemperatureMedicines(): Promise<TemperatureMedicine[]> {
    const options = this.buildHeaders();
    const data = await firstValueFrom(this.http.get<any[]>(this.API_URL, options));

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
    const options = this.buildHeaders('application/json'); // ADD THIS
    const item = await firstValueFrom(this.http.post<any>(this.API_URL, {
      medicineId: medicine.medicineId,
      temperature: medicine.temperature,
      state: medicine.state,
      stock: medicine.stock,
      location: medicine.location
    }, options));

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
    const options = this.buildHeaders('application/json');
    const item = await firstValueFrom(this.http.put<any>(`${this.API_URL}/${medicine.id}`, {
      medicineId: medicine.medicineId,
      temperature: medicine.temperature,
      state: medicine.state,
      stock: medicine.stock,
      location: medicine.location
    }, options)); // ADD options

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
    const options = this.buildHeaders();
    await firstValueFrom(this.http.delete<void>(`${this.API_URL}/${id}`, options));
  }
}
