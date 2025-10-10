import { inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { BaseEntity } from './base-entity';
import { BaseResponse } from './base-response';
import { BaseAssembler } from './base-assembler';

/**
 * Base API endpoint providing generic CRUD operations
 * @template TEntity - Domain entity type
 * @template TResponse - API response type
 * @template TAssembler - Assembler type for conversions
 */
export abstract class BaseApiEndpoint<
  TEntity extends BaseEntity,
  TResponse extends BaseResponse,
  TAssembler extends BaseAssembler<TEntity, TResponse>
> {
  protected http = inject(HttpClient);
  protected abstract basePath: string;
  protected abstract apiUrl: string;
  protected abstract assembler: TAssembler;

  /**
   * Get all entities
   * @returns Observable of entity array
   */
  getAll(): Observable<TEntity[]> {
    return this.http.get<TResponse[]>(`${this.apiUrl}${this.basePath}`)
      .pipe(
        retry(2),
        map(responses => this.assembler.toEntityList(responses)),
        catchError(this.handleError('getAll'))
      );
  }

  /**
   * Get entity by ID
   * @param id - Entity ID (number)
   * @returns Observable of entity
   */
  getById(id: number): Observable<TEntity> {
    return this.http.get<TResponse>(`${this.apiUrl}${this.basePath}/${id}`)
      .pipe(
        retry(2),
        map(response => this.assembler.toEntity(response)),
        catchError(this.handleError(`getById id=${id}`))
      );
  }

  /**
   * Create new entity
   * @param entity - Entity to create
   * @returns Observable of created entity
   */
  create(entity: TEntity): Observable<TEntity> {
    const resource = this.assembler.toResource(entity);
    return this.http.post<TResponse>(`${this.apiUrl}${this.basePath}`, resource)
      .pipe(
        map(response => this.assembler.toEntity(response)),
        catchError(this.handleError('create'))
      );
  }

  /**
   * Update existing entity
   * @param entity - Entity to update
   * @param id - Entity ID (number)
   * @returns Observable of updated entity
   */
  update(entity: TEntity, id: number): Observable<TEntity> {
    const resource = this.assembler.toResource(entity);
    return this.http.put<TResponse>(`${this.apiUrl}${this.basePath}/${id}`, resource)
      .pipe(
        map(response => this.assembler.toEntity(response)),
        catchError(this.handleError(`update id=${id}`))
      );
  }

  /**
   * Partially update entity
   * @param partialEntity - Partial entity data
   * @param id - Entity ID (number)
   * @returns Observable of updated entity
   */
  patch(partialEntity: Partial<TEntity>, id: number): Observable<TEntity> {
    return this.http.patch<TResponse>(`${this.apiUrl}${this.basePath}/${id}`, partialEntity)
      .pipe(
        map(response => this.assembler.toEntity(response)),
        catchError(this.handleError(`patch id=${id}`))
      );
  }

  /**
   * Delete entity
   * @param id - Entity ID (number)
   * @returns Observable of void
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${this.basePath}/${id}`)
      .pipe(
        catchError(this.handleError(`delete id=${id}`))
      );
  }

  /**
   * Handle HTTP errors
   * @param operation - Name of the operation that failed
   * @returns Error handler function
   */
  protected handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      let errorMessage = `${operation} failed`;

      if (error.status === 0) {
        errorMessage = `${operation}: Network error - please check your connection`;
      } else if (error.status === 404) {
        errorMessage = `${operation}: Resource not found`;
      } else if (error.status === 400) {
        errorMessage = `${operation}: Invalid request`;
      } else if (error.status === 500) {
        errorMessage = `${operation}: Server error`;
      } else {
        errorMessage = `${operation}: ${error.message}`;
      }

      console.error(errorMessage, error);
      return throwError(() => new Error(errorMessage));
    };
  }
}
