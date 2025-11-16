import { Injectable } from '@angular/core';
import { Medicament, CreateMedicamentRequest, UpdateMedicamentRequest } from '../domain/model/medicament.entity';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicamentApiService {
  private readonly API_URL = `${environment.apiUrl}/medicines`;

  constructor(private http: HttpClient) {}

  private buildHeaders(contentType?: string) {
    const token = localStorage.getItem('jwt_token');

    let headers = new HttpHeaders();
    if (contentType) {
      headers = headers.set('Content-Type', contentType);
    }
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return { headers };
  }

  async getMedicaments(): Promise<Medicament[]> {
    const options = this.buildHeaders();
    const data = await firstValueFrom(this.http.get<any[]>(this.API_URL, options));

    return data.map((item: any) => ({
      id: Number(item.id ?? 0),
      name: item.name ?? '',
      expirationDate: item.expirationDate ?? '',
      imageUrl: item.imageUrl ?? item.image ?? ''
    }));
  }

  async createMedicament(medicament: CreateMedicamentRequest): Promise<Medicament> {
    const options = this.buildHeaders('application/json');
    const item = await firstValueFrom(this.http.post<any>(this.API_URL, {
      name: medicament.name,
      expirationDate: medicament.expirationDate,
      imageUrl: medicament.imageUrl
    }, options));

    return {
      id: Number(item.id ?? 0),
      name: item.name ?? '',
      expirationDate: item.expirationDate ?? '',
      imageUrl: item.imageUrl ?? item.image ?? ''
    };
  }

  async updateMedicament(medicament: UpdateMedicamentRequest): Promise<Medicament> {
    const options = this.buildHeaders('application/json');
    const item = await firstValueFrom(this.http.put<any>(`${this.API_URL}/${medicament.id}`, {
      name: medicament.name,
      expirationDate: medicament.expirationDate,
      imageUrl: medicament.imageUrl
    }, options));

    return {
      id: Number(item.id ?? medicament.id ?? 0),
      name: item.name ?? medicament.name ?? '',
      expirationDate: item.expirationDate ?? medicament.expirationDate ?? '',
      imageUrl: item.imageUrl ?? item.image ?? medicament.imageUrl ?? ''
    };
  }

  async deleteMedicament(id: number): Promise<void> {
    const options = this.buildHeaders();
    await firstValueFrom(this.http.delete<void>(`${this.API_URL}/${id}`, options));
  }
}
