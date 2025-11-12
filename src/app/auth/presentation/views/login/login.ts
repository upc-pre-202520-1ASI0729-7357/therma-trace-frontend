import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { LoginCredentials } from '../../../domain/entities/login-credentials.entity';
import { LanguageSwitcher } from '../../../../shared/presentation/components/language-switcher/language-switcher';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    TranslateModule,
    LanguageSwitcher
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials: LoginCredentials = this.loginForm.value;

      this.authService.signIn(credentials).subscribe({
        next: (response) => {
          console.log('✅ Login successful:', response);
          console.log('✅ JWT Token stored in localStorage');

          // Navigate to home/dashboard
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('❌ Login error:', error);

          // Handle specific error messages from backend
          if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else if (error.status === 404 || error.status === 400) {
            this.errorMessage = 'Invalid email or password';
          } else {
            this.errorMessage = 'Login failed. Please try again.';
          }

          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}