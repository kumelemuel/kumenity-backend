import { UserCreatedEvent } from '../events/user-created.event';
import { UserId } from '../value-objects/user-id.vo';
import { Email } from '../value-objects/email.vo';

describe('UserCreatedEvent', () => {
  it('should create a valid domain event', () => {
    const userId = UserId.create();
    const email = Email.create('test@example.com');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
    const event = new UserCreatedEvent(userId, email);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(event.occurredOn).toBeInstanceOf(Date);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    expect(event.userId.equals(userId)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    expect(event.email.equals(email)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(event.eventName).toBe('user.created');
  });
});
