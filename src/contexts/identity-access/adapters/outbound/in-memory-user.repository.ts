import { User } from '../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../application/ports/outbound/user-repository.port';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { Email } from '../../domain/value-objects/email.vo';
import { Username } from '../../domain/value-objects/username.vo';

export class InMemoryUserRepository implements UserRepositoryPort {
  private users: User[] = [];

  async findByUsername(username: Username): Promise<User | null> {
    return this.users.find((u) => u.props.username.equals(username)) || null;
  }

  async findById(id: UserId): Promise<User | null> {
    return this.users.find((u) => u.id.equals(id)) || null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    return this.users.find((u) => u.props.email.equals(email)) || null;
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}
