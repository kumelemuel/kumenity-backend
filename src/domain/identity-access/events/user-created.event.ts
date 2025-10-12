import { DomainEvent } from '../../shared/domain-event';
import { UserId } from '../value-objects/user-id.vo';
import { Email } from '../value-objects/email.vo';

export class UserCreatedEvent extends DomainEvent {
  readonly userId: UserId;
  readonly email: Email;

  constructor(userId: UserId, email: Email) {
    super('user.created');
    this.userId = userId;
    this.email = email;
  }
}
