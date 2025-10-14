import { DomainError } from '@domain/shared/exceptions/domain-error';

export class UserAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`User already exists with email: ${email}`, 'USER_ALREADY_EXISTS');
  }
}
