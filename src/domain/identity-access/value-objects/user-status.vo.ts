import { InvalidArgumentError } from '@domain/shared/exceptions/invalid-argument.error';
import { ValueObject } from '@domain/shared/value-object';

export enum UserStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  PENDING = 'pending',
}

interface UserStatusProps {
  value: UserStatusEnum;
}

export class UserStatus extends ValueObject<UserStatusProps> {
  private constructor(props: UserStatusProps) {
    super(props);
  }

  get value(): UserStatusEnum {
    return this.props.value;
  }

  public static create(value: string): UserStatus {
    if (!Object.values(UserStatusEnum).includes(value as UserStatusEnum)) {
      throw new InvalidArgumentError(`Invalid user status: ${value}`);
    }
    return new UserStatus({ value: value as UserStatusEnum });
  }

  public static active(): UserStatus {
    return UserStatus.create('active');
  }

  public static inactive(): UserStatus {
    return UserStatus.create('inactive');
  }

  public static banned(): UserStatus {
    return UserStatus.create('banned');
  }

  public static pending(): UserStatus {
    return UserStatus.create('pending');
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
