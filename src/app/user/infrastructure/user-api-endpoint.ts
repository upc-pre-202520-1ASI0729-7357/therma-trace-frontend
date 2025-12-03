import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { BaseStringApiEndpoint } from '../../shared/infrastructure/base-string-api-endpoint';
import { User, Timezone, Plan, PaymentMethod, Language } from '../domain/user.entity';
import {
  UserResponse,
  TimezoneResponse,
  PlanResponse,
  PaymentMethodResponse,
  CreatePaymentMethodRequest,
  UpdatePaymentMethodRequest,
  LanguageResponse
} from './user-response.interface';
import {
  UserAssembler,
  TimezoneAssembler,
  PlanAssembler,
  PaymentMethodAssembler,
  LanguageAssembler
} from './user-assembler';

/**
 * User API endpoint
 */
@Injectable({
  providedIn: 'root'
})
export class UserApiEndpoint extends BaseApiEndpoint<User, UserResponse, UserAssembler> {
  protected basePath = '/profile';
  protected apiUrl = environment.apiUrl;
  protected assembler = inject(UserAssembler);

  /**
   * Get current user profile
   * Since the API returns a single profile object, not an array
   */
  getProfile(): Observable<User> {
    return this.http.get<UserResponse>(`${this.apiUrl}${this.basePath}`)
      .pipe(
        retry(2),
        map(response => this.assembler.toEntity(response)),
        catchError(this.handleError('getProfile'))
      );
  }

  /**
   * Update current user profile
   * @param partialUser - Partial user data to update
   */
  updateProfile(partialUser: Partial<User>): Observable<User> {
    // Map planId to currentPlan for backend compatibility
    const payload: any = { ...partialUser };
    if (payload.planId) {
      payload.currentPlan = payload.planId;
      delete payload.planId;
    }

    return this.http.patch<UserResponse>(`${this.apiUrl}${this.basePath}`, payload)
      .pipe(
        map(response => this.assembler.toEntity(response)),
        catchError(this.handleError('updateProfile'))
      );
  }
}

/**
 * Timezone API endpoint (uses string ID)
 */
@Injectable({
  providedIn: 'root'
})
export class TimezoneApiEndpoint extends BaseStringApiEndpoint<Timezone, TimezoneResponse, TimezoneAssembler> {
  protected basePath = '/timezones';
  protected apiUrl = environment.apiUrl;
  protected assembler = inject(TimezoneAssembler);
}

/**
 * Plan API endpoint (uses string ID)
 */
@Injectable({
  providedIn: 'root'
})
export class PlanApiEndpoint extends BaseStringApiEndpoint<Plan, PlanResponse, PlanAssembler> {
  protected basePath = '/plans';
  protected apiUrl = environment.apiUrl;
  protected assembler = inject(PlanAssembler);
}

/**
 * Payment Method API endpoint
 *
 * IMPORTANT: Backend API behavior differs from standard CRUD:
 * - GET /paymentMethods returns a single payment method (not an array)
 * - POST requires full card details (cardNumber, cvv)
 * - PUT updates without requiring ID in URL (user can only have one payment method)
 * - DELETE removes the user's payment method (no ID needed)
 */
@Injectable({
  providedIn: 'root'
})
export class PaymentMethodApiEndpoint extends BaseApiEndpoint<PaymentMethod, PaymentMethodResponse, PaymentMethodAssembler> {
  protected basePath = '/paymentMethods';
  protected apiUrl = environment.apiUrl;
  protected assembler = inject(PaymentMethodAssembler);

  /**
   * Get user's payment method
   * Backend returns single object, not array
   */
  getUserPaymentMethod(): Observable<PaymentMethod | null> {
    return this.http.get<PaymentMethodResponse>(`${this.apiUrl}${this.basePath}`)
      .pipe(
        retry(2),
        map(response => this.assembler.toEntity(response)),
        catchError(error => {
          // 404 means no payment method exists
          if (error.status === 404) {
            return of(null);
          }
          return this.handleError('getUserPaymentMethod')(error);
        })
      );
  }

  /**
   * Create payment method with full card details
   * @param request - Create payment method request with full card number and CVV
   */
  createPaymentMethod(request: CreatePaymentMethodRequest): Observable<PaymentMethod> {
    return this.http.post<PaymentMethodResponse>(`${this.apiUrl}${this.basePath}`, request)
      .pipe(
        map(response => this.assembler.toEntity(response)),
        catchError(this.handleError('createPaymentMethod'))
      );
  }

  /**
   * Update payment method with full card details
   * Backend doesn't require ID in URL (user can only have one payment method)
   * @param request - Update payment method request with full card number and CVV
   */
  updatePaymentMethod(request: UpdatePaymentMethodRequest): Observable<PaymentMethod> {
    return this.http.put<PaymentMethodResponse>(`${this.apiUrl}${this.basePath}`, request)
      .pipe(
        map(response => this.assembler.toEntity(response)),
        catchError(this.handleError('updatePaymentMethod'))
      );
  }

  /**
   * Delete user's payment method
   * Backend doesn't require ID in URL (user can only have one payment method)
   */
  deletePaymentMethod(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${this.basePath}`)
      .pipe(
        catchError(this.handleError('deletePaymentMethod'))
      );
  }
}

/**
 * Language API endpoint (uses string ID)
 */
@Injectable({
  providedIn: 'root'
})
export class LanguageApiEndpoint extends BaseStringApiEndpoint<Language, LanguageResponse, LanguageAssembler> {
  protected basePath = '/languages';
  protected apiUrl = environment.apiUrl;
  protected assembler = inject(LanguageAssembler);
}
