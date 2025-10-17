import { InvalidArgumentError } from '@domain/shared/exceptions/invalid-argument.error';

export enum UserStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  PENDING = 'pending',
}

export class UserStatus {
  private readonly value: UserStatusEnum;

  private constructor(value: UserStatusEnum) {
    this.value = value;
  }

  public static create(value: string): UserStatus {
    if (!Object.values(UserStatusEnum).includes(value as UserStatusEnum)) {
      throw new InvalidArgumentError(`Invalid user status: ${value}`);
    }
    return new UserStatus(value as UserStatusEnum);
  }

  public static active(): UserStatus {
    return new UserStatus(UserStatusEnum.ACTIVE);
  }

  public static inactive(): UserStatus {
    return new UserStatus(UserStatusEnum.INACTIVE);
  }

  public static banned(): UserStatus {
    return new UserStatus(UserStatusEnum.BANNED);
  }

  public static pending(): UserStatus {
    return new UserStatus(UserStatusEnum.PENDING);
  }

  public equals(other: UserStatus): boolean {
    return this.value === other.value;
  }

  public getValue(): string {
    return this.value;
  }

  public isActive(): boolean {
    return this.value === UserStatusEnum.ACTIVE;
  }

  public isInactive(): boolean {
    return this.value === UserStatusEnum.INACTIVE;
  }

  public isBanned(): boolean {
    return this.value === UserStatusEnum.BANNED;
  }

  public isPending(): boolean {
    return this.value === UserStatusEnum.PENDING;
  }
}
