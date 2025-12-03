import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export interface Medicament extends BaseEntity {
  name: string;
  expirationDate: string;
  imageUrl: string;
}

export interface CreateMedicamentRequest {
  name: string;
  expirationDate: string;
  imageUrl: string;
}

export interface UpdateMedicamentRequest {
  id: number;
  name: string;
  expirationDate: string;
  imageUrl: string;
}
