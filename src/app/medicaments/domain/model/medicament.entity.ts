import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export interface Medicament extends BaseEntity {
  name: string;
  temperature: string;
  expirationDate: string;
  image: string;
}

export interface CreateMedicamentRequest {
  name: string;
  temperature: string;
  expirationDate: string;
  image: string;
}

export interface UpdateMedicamentRequest {
  id: number;
  name: string;
  temperature: string;
  expirationDate: string;
  image: string;
}
