import { User } from '../entities/user.entity';

export class UserDomainService {
  public static hasDuplicateEmail(users: User[]): boolean {
    const seen = new Set<string>();

    for (const user of users) {
      const email = user.email.value;
      if (seen.has(email)) return true;
      seen.add(email);
    }

    return false;
  }
}
