import { UserId } from '../value-objects/user-id.vo';
import { Email } from '../value-objects/email.vo';
import { UserCreatedEvent } from '../events/user-created.event';
import { DomainEvent } from '../../../../shared/domain-event';
import { InvalidArgumentError } from '../../../../shared/exceptions/invalid-argument.error';
import { Username } from '../value-objects/username.vo';
import { UserStatus } from '../value-objects/user-status.vo';
import { Password } from '../value-objects/password.vo';

interface UserProps {
  id: UserId;
  email: Email;
  username: Username;
  password: Password;
  status: UserStatus;
  authCode: number | null;
  createdAt: Date;
}

export class User {
  private domainEvents: DomainEvent[] = [];

  private constructor(readonly props: UserProps) {}

  get id(): UserId {
    return this.props.id;
  }

  get email(): Email {
    return this.props.email;
  }

  get username(): Username {
    return this.props.username;
  }

  get authCode(): number | null {
    return this.props.authCode;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  public static create(props: UserProps): User {
    if (!props.email) {
      throw new InvalidArgumentError('Email is required');
    }

    if (!props.username) {
      throw new InvalidArgumentError('Username is required');
    }

    if (!props.password) {
      throw new InvalidArgumentError('Password is required');
    }

    const user = new User({ ...props });

    user.addDomainEvent(new UserCreatedEvent(props.id, props.email));
    return user;
  }

  public pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }

  public equals(other: User): boolean {
    return this.id.equals(other.id);
  }

  public activate(): void {
    this.props.authCode = null;
    this.props.status = UserStatus.create('active');
  }

  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }
}
