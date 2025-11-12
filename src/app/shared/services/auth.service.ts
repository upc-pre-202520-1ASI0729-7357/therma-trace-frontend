import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Sign Up Request - matches backend SignUpResource
 */
export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
}

/**
 * Sign In Request - matches backend SignInResource
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * User Response from backend - matches UserResource
 */
export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  timezoneId: string | null;
  languageId: string | null;
  currentPlan: string;
  role: string;
}

/**
 * Authenticated User Response - matches AuthenticatedUserResource
 */
export interface AuthenticatedUserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

/**
 * Authentication Service
 * Handles user registration, login, logout, and token management
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/authentication`;

  constructor(private http: HttpClient) {}

  /**
   * Register a new user
   * @param data - Registration form data
   * @returns Observable of created user
   */
  signUp(data: any): Observable<UserResponse> {
    // Transform frontend data to match backend expectations
    const requestBody: SignUpRequest = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      roles: [] // Always empty for regular users
    };

    return this.http.post<UserResponse>(
      `${this.apiUrl}/sign-up`,
      requestBody
    );
  }

  /**
   * Login user and store JWT token
   * @param credentials - Login credentials
   * @returns Observable of authenticated user with token
   */
  signIn(credentials: any): Observable<AuthenticatedUserResponse> {
    // Transform frontend data to match backend expectations
    const requestBody: SignInRequest = {
      email: credentials.email,
      password: credentials.password
    };

    return this.http.post<AuthenticatedUserResponse>(
      `${this.apiUrl}/sign-in`,
      requestBody
    ).pipe(
      tap(response => {
        // Store JWT token in localStorage
        localStorage.setItem('jwt_token', response.token);

        // Store user data (compute fullName for frontend)
        const userData = {
          id: response.id,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          fullName: `${response.firstName} ${response.lastName}`
        };
        localStorage.setItem('current_user', JSON.stringify(userData));

        // Handle "Remember Me" if provided
        if (credentials.rememberMe) {
          localStorage.setItem('remember_me', 'true');
        }

        console.log('✅ User authenticated successfully');
      })
    );
  }

  /**
   * Get current user from localStorage
   * @returns Current user or null
   */
  getCurrentUser(): any {
    const userData = localStorage.getItem('current_user');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Get JWT token from localStorage
   * @returns JWT token or null
   */
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  /**
   * Check if user is authenticated
   * Validates token existence and expiration
   * @returns true if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Decode JWT and check expiration
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expiry;
    } catch (e) {
      console.error('Invalid token format', e);
      return false;
    }
  }

  /**
   * Logout user and clear stored data
   */
  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('remember_me');
    console.log('✅ User logged out');
  }
}