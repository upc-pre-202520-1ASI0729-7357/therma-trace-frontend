import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Functional HTTP Interceptor for JWT Authentication
 * Automatically adds Authorization header with Bearer token to all requests
 * except authentication endpoints (sign-up, sign-in)
 *
 * @see https://angular.dev/guide/http/interceptors
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip adding token for authentication endpoints
  if (req.url.includes('/authentication/')) {
    return next(req);
  }

  // Get JWT token from localStorage
  const token = localStorage.getItem('jwt_token');

  // TEMP LOG: help diagnose 403 issues (remove in production)
  try {
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    console.log('[authInterceptor] req:', req.method, req.url, 'tokenExists=', !!token, 'payload=', payload ? { exp: payload.exp, role: payload.role ?? payload.roles ?? null } : null);
  } catch (err) {
    console.log('[authInterceptor] req:', req.method, req.url, 'tokenExists=', !!token, 'payload= <invalid token>');
  }

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
