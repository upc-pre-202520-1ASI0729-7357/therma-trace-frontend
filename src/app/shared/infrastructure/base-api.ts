import { environment } from '../../../environments/environment';

/**
 * Base API configuration
 */
export abstract class BaseApi {
  protected readonly apiUrl = `${environment.apiUrl}/api/v1`;
}
