import { BaseEntity, BaseStringEntity } from '../../shared/infrastructure/base-entity';

/**
 * User domain entity
 */
export interface User extends BaseEntity {
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  timezoneId: string;
  planId: string;
  languageId: string;
  paymentMethodId: number | null;
}

/**
 * Timezone entity (uses string ID)
 */
export interface Timezone extends BaseStringEntity {
  name: string;
  offset: string;
}

/**
 * Plan entity (uses string ID)
 */
export interface Plan extends BaseStringEntity {
  name: string;
  price: number;
  features: string[];
}

/**
 * Payment Method entity
 */
export interface PaymentMethod extends BaseEntity {
  cardType: string;
  lastFourDigits: string;
  expiryMonth: string;
  expiryYear: string;
  cardholderName: string;
}

/**
 * Language entity (uses string ID)
 */
export interface Language extends BaseStringEntity {
  name: string;
  code: string;
}
