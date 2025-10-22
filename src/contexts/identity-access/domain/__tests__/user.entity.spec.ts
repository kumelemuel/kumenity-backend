import { User } from '../entities/user.entity';
import { UserId } from '../value-objects/user-id.vo';
import { Email } from '../value-objects/email.vo';
import { UserStatus } from '../value-objects/user-status.vo';
import { Username } from '../value-objects/username.vo';
import { Password } from '../value-objects/password.vo';

describe('User Entity', () => {
  const valid_password =
    '$2a$12$DIvmJUDVluP4xvSgJLSNxukhXU1TcFpp.exoMiIcJXvKCRSy33gI6';
  it('should create a valid user', () => {
    const user = User.create({
      id: UserId.create(),
      username: Username.create('test.user'),
      email: Email.create('user@example.com'),
      password: Password.create(valid_password),
      createdAt: new Date(),
      authCode: null,
      status: UserStatus.create('pending'),
    });

    expect(user.email.value).toBe('user@example.com');
    expect(user.username.value).toBe('test.user');
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
        password: Password.create(valid_password),
        createdAt: new Date(),
        authCode: null,
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
        password: Password.create(valid_password),
        createdAt: new Date(),
        authCode: null,
        status: UserStatus.create('pending'),
      }),
    ).toThrow();
  });

  it('should throw error when password is missing', () => {
    expect(() =>
      User.create({
        id: UserId.create(),
        username: Username.create('test.user'),
        email: Email.create('user@example.com'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        password: null as any,
        createdAt: new Date(),
        authCode: null,
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
      password: Password.create(valid_password),
      createdAt: new Date(),
      authCode: null,
      status: UserStatus.create('pending'),
    });
    const user2 = User.create({
      id,
      email: Email.create('b@example.com'),
      username: Username.create('test.user'),
      password: Password.create(valid_password),
      createdAt: new Date(),
      authCode: null,
      status: UserStatus.create('pending'),
    });

    expect(user1.equals(user2)).toBe(true);
  });

  it('should activate correctly an user', () => {
    const user = User.create({
      id: UserId.create(),
      username: Username.create('test.user'),
      email: Email.create('user@example.com'),
      password: Password.create(valid_password),
      createdAt: new Date(),
      authCode: 123456,
      status: UserStatus.create('pending'),
    });

    user.activate();

    expect(user.authCode).toBe(null);
    expect(user.status.value).toBe('active');
  });
});
