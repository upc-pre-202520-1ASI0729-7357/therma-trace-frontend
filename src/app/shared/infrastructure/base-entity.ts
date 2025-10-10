/**
 * Base interface for all domain entities with numeric ID
 */
export interface BaseEntity {
  id: number;
}

/**
 * Base interface for entities with string ID (e.g., enums, configurations)
 */
export interface BaseStringEntity {
  id: string;
}
