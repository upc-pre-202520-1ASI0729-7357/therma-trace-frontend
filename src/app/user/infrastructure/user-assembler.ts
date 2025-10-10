import { Injectable } from '@angular/core';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { BaseStringAssembler } from '../../shared/infrastructure/base-string-assembler';
import { User, Timezone, Plan, PaymentMethod, Language } from '../domain/user.entity';
import {
  UserResponse,
  TimezoneResponse,
  PlanResponse,
  PaymentMethodResponse,
  LanguageResponse
} from './user-response.interface';

/**
 * User assembler for converting between User entities and API responses
 */
@Injectable({
  providedIn: 'root'
})
export class UserAssembler extends BaseAssembler<User, UserResponse> {
  /**
   * Convert API response to User entity
   * @param response - User API response
   * @returns User entity
   */
  toEntity(response: UserResponse): User {
    return {
      id: response.id,
      fullName: response.fullName,
      email: response.email,
      phone: response.phone,
      avatar: response.avatar,
      role: response.role,
      timezoneId: response.timezoneId,
      planId: response.planId,
      languageId: response.languageId,
      paymentMethodId: response.paymentMethodId
    };
  }

  /**
   * Convert User entity to API resource
   * @param entity - User entity
   * @returns API resource object
   */
  toResource(entity: User): UserResponse {
    return {
      id: entity.id,
      fullName: entity.fullName,
      email: entity.email,
      phone: entity.phone,
      avatar: entity.avatar,
      role: entity.role,
      timezoneId: entity.timezoneId,
      planId: entity.planId,
      languageId: entity.languageId,
      paymentMethodId: entity.paymentMethodId
    };
  }
}

/**
 * Timezone assembler (string ID)
 */
@Injectable({
  providedIn: 'root'
})
export class TimezoneAssembler extends BaseStringAssembler<Timezone, TimezoneResponse> {
  toEntity(response: TimezoneResponse): Timezone {
    return {
      id: response.id,
      name: response.name,
      offset: response.offset
    };
  }

  toResource(entity: Timezone): TimezoneResponse {
    return {
      id: entity.id,
      name: entity.name,
      offset: entity.offset
    };
  }
}

/**
 * Plan assembler (string ID)
 */
@Injectable({
  providedIn: 'root'
})
export class PlanAssembler extends BaseStringAssembler<Plan, PlanResponse> {
  toEntity(response: PlanResponse): Plan {
    return {
      id: response.id,
      name: response.name,
      price: response.price,
      features: response.features
    };
  }

  toResource(entity: Plan): PlanResponse {
    return {
      id: entity.id,
      name: entity.name,
      price: entity.price,
      features: entity.features
    };
  }
}

/**
 * Payment Method assembler
 */
@Injectable({
  providedIn: 'root'
})
export class PaymentMethodAssembler extends BaseAssembler<PaymentMethod, PaymentMethodResponse> {
  toEntity(response: PaymentMethodResponse): PaymentMethod {
    return {
      id: response.id,
      cardType: response.cardType,
      lastFourDigits: response.lastFourDigits,
      expiryMonth: response.expiryMonth,
      expiryYear: response.expiryYear,
      cardholderName: response.cardholderName
    };
  }

  toResource(entity: PaymentMethod): PaymentMethodResponse {
    return {
      id: entity.id,
      cardType: entity.cardType,
      lastFourDigits: entity.lastFourDigits,
      expiryMonth: entity.expiryMonth,
      expiryYear: entity.expiryYear,
      cardholderName: entity.cardholderName
    };
  }
}

/**
 * Language assembler (string ID)
 */
@Injectable({
  providedIn: 'root'
})
export class LanguageAssembler extends BaseStringAssembler<Language, LanguageResponse> {
  toEntity(response: LanguageResponse): Language {
    return {
      id: response.id,
      name: response.name,
      code: response.code
    };
  }

  toResource(entity: Language): LanguageResponse {
    return {
      id: entity.id,
      name: entity.name,
      code: entity.code
    };
  }
}
