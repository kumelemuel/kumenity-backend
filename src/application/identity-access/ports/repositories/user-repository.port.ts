import { User } from '@domain/identity-access/entities/user.entity';
import { UserId } from '@domain/identity-access/value-objects/user-id.vo';
import { Email } from '@domain/identity-access/value-objects/email.vo';
import { Username } from '@domain/identity-access/value-objects/username.vo';

export interface UserRepositoryPort {
  save(user: User): Promise<void>;
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findByUsername(username: Username): Promise<User | null>;
}
