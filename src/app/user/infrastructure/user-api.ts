import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { User, Timezone, Plan, PaymentMethod, Language } from '../domain/user.entity';
import {
  UserApiEndpoint,
  TimezoneApiEndpoint,
  PlanApiEndpoint,
  PaymentMethodApiEndpoint,
  LanguageApiEndpoint
} from './user-api-endpoint';

/**
 * User API - Aggregate repository for user-related operations
 * Acts as the main entry point for all user domain API operations
 */
@Injectable({
  providedIn: 'root'
})
export class UserApi extends BaseApi {
  private userEndpoint = inject(UserApiEndpoint);
  private timezoneEndpoint = inject(TimezoneApiEndpoint);
  private planEndpoint = inject(PlanApiEndpoint);
  private paymentMethodEndpoint = inject(PaymentMethodApiEndpoint);
  private languageEndpoint = inject(LanguageApiEndpoint);

  // User operations
  getProfile(): Observable<User> {
    return this.userEndpoint.getProfile();
  }

  updateProfile(partialUser: Partial<User>): Observable<User> {
    return this.userEndpoint.updateProfile(partialUser);
  }

  // Timezone operations
  getTimezones(): Observable<Timezone[]> {
    return this.timezoneEndpoint.getAll();
  }

  getTimezoneById(id: string): Observable<Timezone> {
    return this.timezoneEndpoint.getById(id);
  }

  // Plan operations
  getPlans(): Observable<Plan[]> {
    return this.planEndpoint.getAll();
  }

  getPlanById(id: string): Observable<Plan> {
    return this.planEndpoint.getById(id);
  }

  // Payment Method operations
  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.paymentMethodEndpoint.getAll();
  }

  getPaymentMethodById(id: number): Observable<PaymentMethod> {
    return this.paymentMethodEndpoint.getById(id);
  }

  createPaymentMethod(paymentMethod: PaymentMethod): Observable<PaymentMethod> {
    return this.paymentMethodEndpoint.create(paymentMethod);
  }

  updatePaymentMethod(paymentMethod: PaymentMethod, id: number): Observable<PaymentMethod> {
    return this.paymentMethodEndpoint.update(paymentMethod, id);
  }

  deletePaymentMethod(id: number): Observable<void> {
    return this.paymentMethodEndpoint.delete(id);
  }

  // Language operations
  getLanguages(): Observable<Language[]> {
    return this.languageEndpoint.getAll();
  }

  getLanguageById(id: string): Observable<Language> {
    return this.languageEndpoint.getById(id);
  }
}
