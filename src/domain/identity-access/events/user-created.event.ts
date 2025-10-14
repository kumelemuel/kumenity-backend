import { Email } from '@domain/identity-access/value-objects/email.vo';
import { UserId } from '@domain/identity-access/value-objects/user-id.vo';
import { DomainEvent } from '@domain/shared/domain-event';

export class UserCreatedEvent extends DomainEvent {
  readonly userId: UserId;
  readonly email: Email;

  constructor(userId: UserId, email: Email) {
    super('user.created');
    this.userId = userId;
    this.email = email;
  }
}
