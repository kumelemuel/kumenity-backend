import { DomainError } from '@domain/shared/exceptions/domain-error';

export class UserAlreadyExistsError extends DomainError {
  constructor(message: string) {
    super(message, 'USER_ALREADY_EXISTS');
  }
}
