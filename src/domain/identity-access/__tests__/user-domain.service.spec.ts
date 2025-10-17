import { User } from '@domain/identity-access/entities/user.entity';
import { UserId } from '@domain/identity-access/value-objects/user-id.vo';
import { Email } from '@domain/identity-access/value-objects/email.vo';
import { UserDomainService } from '@domain/identity-access/services/user-domain.service';
import { UserStatus } from '@domain/identity-access/value-objects/user-status.vo';
import { Username } from '@domain/identity-access/value-objects/username.vo';

describe('UserDomainService', () => {
  it('should detect duplicate emails between users', () => {
    const user1 = User.create({
      id: UserId.create(),
      username: Username.create('test.user'),
      email: Email.create('test@example.com'),
      createdAt: new Date(),
      status: UserStatus.create('pending'),
    });

    const user2 = User.create({
      id: UserId.create(),
      username: Username.create('test.user'),
      email: Email.create('test@example.com'),
      createdAt: new Date(),
      status: UserStatus.create('pending'),
    });

    const duplicated = UserDomainService.hasDuplicateEmail([user1, user2]);
    expect(duplicated).toBe(true);
  });

  it('should return false when all emails are unique', () => {
    const user1 = User.create({
      id: UserId.create(),
      username: Username.create('test.user'),
      email: Email.create('a@example.com'),
      createdAt: new Date(),
      status: UserStatus.create('pending'),
    });

    const user2 = User.create({
      id: UserId.create(),
      username: Username.create('test.user'),
      email: Email.create('b@example.com'),
      createdAt: new Date(),
      status: UserStatus.create('pending'),
    });

    const duplicated = UserDomainService.hasDuplicateEmail([user1, user2]);
    expect(duplicated).toBe(false);
  });
});
