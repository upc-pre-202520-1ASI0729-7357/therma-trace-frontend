import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export interface MedicineInfo {
  id: number;
  name: string;
  expirationDate: string;
  image: string;
}

export interface TemperatureMedicine extends BaseEntity {
  temperature: number;
  state: string;
  stock: number;
  location: string;
  medicine: MedicineInfo;
}

export interface CreateTemperatureMedicineRequest {
  medicineId: number;
  temperature: number;
  state: string;
  stock: number;
  location: string;
}

export interface UpdateTemperatureMedicineRequest {
  id: number;
  medicineId: number;
  temperature: number;
  state: string;
  stock: number;
  location: string;
}
