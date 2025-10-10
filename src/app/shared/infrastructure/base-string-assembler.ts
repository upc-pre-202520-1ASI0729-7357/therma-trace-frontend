import { BaseStringEntity } from './base-entity';
import { BaseResponse } from './base-response';

/**
 * Base assembler for converting between domain entities with string IDs and API responses
 * Implements the Anti-Corruption Layer pattern
 */
export abstract class BaseStringAssembler<TEntity extends BaseStringEntity, TResponse extends BaseResponse> {
  /**
   * Convert API response to domain entity
   * @param response - The API response object
   * @returns Domain entity
   */
  abstract toEntity(response: TResponse): TEntity;

  /**
   * Convert domain entity to API resource format
   * @param entity - The domain entity
   * @returns API resource object
   */
  abstract toResource(entity: TEntity): TResponse;

  /**
   * Convert multiple API responses to domain entities
   * @param responses - Array of API response objects
   * @returns Array of domain entities
   */
  toEntityList(responses: TResponse[]): TEntity[] {
    return responses.map(response => this.toEntity(response));
  }

  /**
   * Convert multiple domain entities to API resources
   * @param entities - Array of domain entities
   * @returns Array of API resource objects
   */
  toResourceList(entities: TEntity[]): TResponse[] {
    return entities.map(entity => this.toResource(entity));
  }
}
