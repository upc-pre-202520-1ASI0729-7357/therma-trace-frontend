import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export interface TemperatureMedicine extends BaseEntity {
  name: string;
  temperature: string;
  expirationDate: string;
}

export interface CreateTemperatureMedicineRequest {
  name: string;
  temperature: string;
  expirationDate: string;
}

export interface UpdateTemperatureMedicineRequest {
  id: number;
  name: string;
  temperature: string;
  expirationDate: string;
}
