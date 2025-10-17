import { User } from '@domain/identity-access/entities/user.entity';
import { UserId } from '@domain/identity-access/value-objects/user-id.vo';
import { Email } from '@domain/identity-access/value-objects/email.vo';
import { UserStatus } from '@domain/identity-access/value-objects/user-status.vo';
import { Username } from '@domain/identity-access/value-objects/username.vo';

describe('User Entity', () => {
  it('should create a valid user', () => {
    const user = User.create({
      id: UserId.create(),
      username: Username.create('test.user'),
      email: Email.create('user@example.com'),
      createdAt: new Date(),
      status: UserStatus.create('pending'),
    });

    expect(user.email.value).toBe('user@example.com');
    expect(user.id.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('should throw error when email is missing', () => {
    expect(() =>
      User.create({
        id: UserId.create(),
        username: Username.create('test.user'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        email: null as any,
        createdAt: new Date(),
        status: UserStatus.create('pending'),
      }),
    ).toThrow();
  });

  it('should throw error when username is missing', () => {
    expect(() =>
      User.create({
        id: UserId.create(),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        username: null as any,
        email: Email.create('user@example.com'),
        createdAt: new Date(),
        status: UserStatus.create('pending'),
      }),
    ).toThrow();
  });

  it('should consider two users equal if they share the same id', () => {
    const id = UserId.create();
    const user1 = User.create({
      id,
      email: Email.create('a@example.com'),
      username: Username.create('test.user'),
      createdAt: new Date(),
      status: UserStatus.create('pending'),
    });
    const user2 = User.create({
      id,
      email: Email.create('b@example.com'),
      username: Username.create('test.user'),
      createdAt: new Date(),
      status: UserStatus.create('pending'),
    });

    expect(user1.equals(user2)).toBe(true);
  });
});
