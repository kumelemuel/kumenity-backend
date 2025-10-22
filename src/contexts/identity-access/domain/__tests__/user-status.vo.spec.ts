import { UserStatus, UserStatusEnum } from '../value-objects/user-status.vo';

describe('UserStatus Value Object', () => {
  it('should create a valid status from enum', () => {
    const status = UserStatus.create('active');
    expect(status.getValue()).toBe(UserStatusEnum.ACTIVE);
  });

  it('should throw if an invalid status is provided', () => {
    expect(() => UserStatus.create('deleted')).toThrow(
      'Invalid user status: deleted',
    );
  });

  it('should create specific statuses using static methods', () => {
    expect(UserStatus.active().isActive()).toBe(true);
    expect(UserStatus.inactive().isInactive()).toBe(true);
    expect(UserStatus.banned().isBanned()).toBe(true);
    expect(UserStatus.pending().isPending()).toBe(true);
  });

  it('should compare equal statuses', () => {
    const a = UserStatus.active();
    const b = UserStatus.create('active');
    expect(a.equals(b)).toBe(true);
  });

  it('should not compare different statuses as equal', () => {
    const a = UserStatus.active();
    const b = UserStatus.banned();
    expect(a.equals(b)).toBe(false);
  });
});
