import { UserId } from '@domain/identity-access/value-objects/user-id.vo';
import { Email } from '@domain/identity-access/value-objects/email.vo';
import { UserCreatedEvent } from '@domain/identity-access/events/user-created.event';

describe('UserCreatedEvent', () => {
  it('should create a valid domain event', () => {
    const userId = UserId.create();
    const email = Email.create('test@example.com');

    const event = new UserCreatedEvent(userId, email);

    expect(event.occurredOn).toBeInstanceOf(Date);
    expect(event.userId.equals(userId)).toBe(true);
    expect(event.email.equals(email)).toBe(true);
    expect(event.eventName).toBe('user.created');
  });
});
