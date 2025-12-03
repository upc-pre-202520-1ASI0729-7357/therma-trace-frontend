import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Functional HTTP Interceptor for JWT Authentication
 * Automatically adds Authorization header with Bearer token to all requests
 * except authentication endpoints (sign-up, sign-in)
 *
 * @see https://angular.dev/guide/http/interceptors
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip adding token for authentication endpoints and external services
  if (req.url.includes('/authentication/') || req.url.includes('cloudinary.com')) {
    return next(req);
  }

  // Get JWT token from localStorage
  const token = localStorage.getItem('jwt_token');

  // If token exists, clone request and add Authorization header
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // No token, send original request
  return next(req);
};
