import { User } from '@domain/identity-access/entities/user.entity';
import { UserId } from '@domain/identity-access/value-objects/user-id.vo';
import { Email } from '@domain/identity-access/value-objects/email.vo';
import { UserDomainService } from '@domain/identity-access/services/user-domain.service';

describe('UserDomainService', () => {
  it('should detect duplicate emails between users', () => {
    const user1 = User.create({
      id: UserId.create(),
      email: Email.create('test@example.com'),
      createdAt: new Date(),
    });

    const user2 = User.create({
      id: UserId.create(),
      email: Email.create('test@example.com'),
      createdAt: new Date(),
    });

    const duplicated = UserDomainService.hasDuplicateEmail([user1, user2]);
    expect(duplicated).toBe(true);
  });

  it('should return false when all emails are unique', () => {
    const user1 = User.create({
      id: UserId.create(),
      email: Email.create('a@example.com'),
      createdAt: new Date(),
    });

    const user2 = User.create({
      id: UserId.create(),
      email: Email.create('b@example.com'),
      createdAt: new Date(),
    });

    const duplicated = UserDomainService.hasDuplicateEmail([user1, user2]);
    expect(duplicated).toBe(false);
  });
});
