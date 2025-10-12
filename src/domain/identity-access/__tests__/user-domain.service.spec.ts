import { UserDomainService } from '../services/user-domain.service';
import { UserId } from '../value-objects/user-id.vo';
import { Email } from '../value-objects/email.vo';
import { User } from '../entities/user.entity';

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
