import { DomainError } from '@domain/shared/exceptions/domain-error';

export class UserNotExistsError extends DomainError {
  constructor(email: string) {
    super(`User not exists with email: ${email}`, 'USER_NOT_EXISTS');
  }
}
