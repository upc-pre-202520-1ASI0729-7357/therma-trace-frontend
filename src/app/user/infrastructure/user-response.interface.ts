import { BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * User API response interface (numeric ID)
 */
export interface UserResponse extends BaseResponse {
  id: number;
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
 * Timezone API response interface (string ID)
 */
export interface TimezoneResponse extends BaseResponse {
  id: string;
  name: string;
  offset: string;
}

/**
 * Plan API response interface (string ID)
 */
export interface PlanResponse extends BaseResponse {
  id: string;
  name: string;
  price: number;
  features: string[];
}

/**
 * Payment Method API response interface (numeric ID)
 */
export interface PaymentMethodResponse extends BaseResponse {
  id: number;
  cardholderName: string;
  lastFourDigits: string;
  maskedCardNumber: string;
  cardType: string;
  expiryMonth: string;
  expiryYear: string;
  expiry: string;
}

/**
 * Create Payment Method request interface
 */
export interface CreatePaymentMethodRequest {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

/**
 * Update Payment Method request interface
 */
export interface UpdatePaymentMethodRequest {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

/**
 * Language API response interface (string ID)
 */
export interface LanguageResponse extends BaseResponse {
  id: string;
  name: string;
  code: string;
}
