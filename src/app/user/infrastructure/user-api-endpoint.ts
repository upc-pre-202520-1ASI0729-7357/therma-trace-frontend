import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
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
  protected apiUrl = `${environment.apiUrl}/api/v1`;
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
    return this.http.patch<UserResponse>(`${this.apiUrl}${this.basePath}`, partialUser)
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
  protected apiUrl = `${environment.apiUrl}/api/v1`;
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
  protected apiUrl = `${environment.apiUrl}/api/v1`;
  protected assembler = inject(PlanAssembler);
}

/**
 * Payment Method API endpoint
 */
@Injectable({
  providedIn: 'root'
})
export class PaymentMethodApiEndpoint extends BaseApiEndpoint<PaymentMethod, PaymentMethodResponse, PaymentMethodAssembler> {
  protected basePath = '/paymentMethods';
  protected apiUrl = `${environment.apiUrl}/api/v1`;
  protected assembler = inject(PaymentMethodAssembler);
}

/**
 * Language API endpoint (uses string ID)
 */
@Injectable({
  providedIn: 'root'
})
export class LanguageApiEndpoint extends BaseStringApiEndpoint<Language, LanguageResponse, LanguageAssembler> {
  protected basePath = '/languages';
  protected apiUrl = `${environment.apiUrl}/api/v1`;
  protected assembler = inject(LanguageAssembler);
}
