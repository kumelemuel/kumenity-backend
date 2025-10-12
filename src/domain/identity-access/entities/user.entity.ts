import { UserId } from '../value-objects/user-id.vo';
import { Email } from '../value-objects/email.vo';
import { DomainEvent } from '../../shared/domain-event';
import { UserCreatedEvent } from '../events/user-created.event';
import { InvalidArgumentError } from '../../shared/exceptions/invalid-argument.error';

interface UserProps {
  id: UserId;
  email: Email;
  createdAt: Date;
}

export class User {
  private domainEvents: DomainEvent[] = [];

  private constructor(private readonly props: UserProps) {}

  get id(): UserId {
    return this.props.id;
  }

  get email(): Email {
    return this.props.email;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  public static create(props: UserProps): User {
    if (!props.email) {
      throw new InvalidArgumentError('Email is required');
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

  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }
}
