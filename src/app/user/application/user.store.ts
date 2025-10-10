import { Injectable, signal, computed, inject } from '@angular/core';
import { catchError, of, tap, forkJoin } from 'rxjs';
import { UserApi } from '../infrastructure/user-api';
import { User, Timezone, Plan, Language, PaymentMethod } from '../domain/user.entity';

/**
 * User Store - Application service for user state management
 * Uses Angular Signals for reactive state management
 */
@Injectable({
  providedIn: 'root'
})
export class UserStore {
  private userApi = inject(UserApi);

  // State signals
  private _user = signal<User | null>(null);
  private _timezones = signal<Timezone[]>([]);
  private _plans = signal<Plan[]>([]);
  private _languages = signal<Language[]>([]);
  private _paymentMethod = signal<PaymentMethod | null>(null);

  // Loading and error states
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly user = this._user.asReadonly();
  readonly timezones = this._timezones.asReadonly();
  readonly plans = this._plans.asReadonly();
  readonly languages = this._languages.asReadonly();
  readonly paymentMethod = this._paymentMethod.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals for derived state
  readonly hasUser = computed(() => this._user() !== null);
  readonly userFullName = computed(() => this._user()?.fullName ?? '');
  readonly userEmail = computed(() => this._user()?.email ?? '');
  readonly userAvatar = computed(() => this._user()?.avatar ?? '/assets/images/img.png');
  readonly userRole = computed(() => this._user()?.role ?? '');

  // Find related entities by ID
  readonly currentTimezone = computed(() => {
    const user = this._user();
    const timezones = this._timezones();
    if (!user) return null;
    return timezones.find(tz => tz.id === user.timezoneId) ?? null;
  });

  readonly currentPlan = computed(() => {
    const user = this._user();
    const plans = this._plans();
    if (!user) return null;
    return plans.find(plan => plan.id === user.planId) ?? null;
  });

  readonly currentLanguage = computed(() => {
    const user = this._user();
    const languages = this._languages();
    if (!user) return null;
    return languages.find(lang => lang.id === user.languageId) ?? null;
  });

  /**
   * Load all user data including profile and related entities
   */
  loadUserData(): void {
    this._isLoading.set(true);
    this._error.set(null);

    // Load all data in parallel using forkJoin
    forkJoin({
      user: this.userApi.getProfile(),
      timezones: this.userApi.getTimezones(),
      plans: this.userApi.getPlans(),
      languages: this.userApi.getLanguages()
    })
      .pipe(
        tap(({ user, timezones, plans, languages }) => {
          this._user.set(user);
          this._timezones.set(timezones);
          this._plans.set(plans);
          this._languages.set(languages);

          // Load payment method if exists
          if (user.paymentMethodId) {
            this.loadPaymentMethod(user.paymentMethodId);
          }
        }),
        catchError(error => {
          this._error.set(error.message || 'Failed to load user data');
          console.error('Error loading user data:', error);
          return of(null);
        })
      )
      .subscribe({
        complete: () => this._isLoading.set(false)
      });
  }

  /**
   * Load user profile only
   */
  loadProfile(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.userApi.getProfile()
      .pipe(
        tap(user => {
          this._user.set(user);
          // Load payment method if exists
          if (user.paymentMethodId) {
            this.loadPaymentMethod(user.paymentMethodId);
          }
        }),
        catchError(error => {
          this._error.set(error.message || 'Failed to load profile');
          console.error('Error loading profile:', error);
          return of(null);
        })
      )
      .subscribe({
        complete: () => this._isLoading.set(false)
      });
  }

  /**
   * Load payment method by ID
   */
  private loadPaymentMethod(id: number): void {
    this.userApi.getPaymentMethodById(id)
      .pipe(
        tap(paymentMethod => this._paymentMethod.set(paymentMethod)),
        catchError(error => {
          console.error('Error loading payment method:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Update user profile
   * @param partialUser - Partial user data to update
   */
  updateProfile(partialUser: Partial<User>): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.userApi.updateProfile(partialUser)
      .pipe(
        tap(updatedUser => {
          this._user.set(updatedUser);

          // Handle payment method changes
          if (updatedUser.paymentMethodId !== null) {
            // Load the payment method if it exists
            this.loadPaymentMethod(updatedUser.paymentMethodId);
          } else {
            // Clear payment method if removed
            this._paymentMethod.set(null);
          }

          console.log('Profile updated successfully');
        }),
        catchError(error => {
          this._error.set(error.message || 'Failed to update profile');
          console.error('Error updating profile:', error);
          return of(null);
        })
      )
      .subscribe({
        complete: () => this._isLoading.set(false)
      });
  }

  /**
   * Load auxiliary data (timezones, plans, languages)
   */
  loadAuxiliaryData(): void {
    forkJoin({
      timezones: this.userApi.getTimezones(),
      plans: this.userApi.getPlans(),
      languages: this.userApi.getLanguages()
    })
      .pipe(
        tap(({ timezones, plans, languages }) => {
          this._timezones.set(timezones);
          this._plans.set(plans);
          this._languages.set(languages);
        }),
        catchError(error => {
          console.error('Error loading auxiliary data:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this._error.set(null);
  }

  /**
   * Reset store state
   */
  reset(): void {
    this._user.set(null);
    this._timezones.set([]);
    this._plans.set([]);
    this._languages.set([]);
    this._paymentMethod.set(null);
    this._isLoading.set(false);
    this._error.set(null);
  }
}
