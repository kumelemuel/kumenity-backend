import { DomainError } from '../../../../shared/exceptions/domain-error';

export class UserAlreadyExistsError extends DomainError {
  constructor(message: string) {
    super(message, 'USER_ALREADY_EXISTS');
  }
}
