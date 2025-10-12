import { DomainError } from './domain-error';

export class EntityNotFoundError extends DomainError {
  constructor(message: string) {
    super(message, 'ENTITY_NOT_FOUND');
  }
}
