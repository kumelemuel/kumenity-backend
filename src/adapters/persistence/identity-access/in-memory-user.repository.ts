import { User } from '@domain/identity-access/entities/user.entity';
import { UserRepositoryPort } from '@application/identity-access/ports/repositories/user-repository.port';
import { UserId } from '@domain/identity-access/value-objects/user-id.vo';

export class InMemoryUserRepository implements UserRepositoryPort {
  private users: User[] = [];

  async findById(id: UserId): Promise<User | null> {
    return this.users.find((u) => u.id.equals(id)) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.props.email.value === email) || null;
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}
