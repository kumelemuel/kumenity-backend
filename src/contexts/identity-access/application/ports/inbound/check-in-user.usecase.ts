import { User } from '../../../domain/entities/user.entity';
import { UserRepositoryPort } from '../outbound/user-repository.port';
import { CheckInUserDto } from '../../dto/check-in-user.dto';
import { Email } from '../../../domain/value-objects/email.vo';
import { Username } from '../../../domain/value-objects/username.vo';
import { UserNotExistsError } from '../../../domain/exceptions/user-not-exists.error';
import { InvalidArgumentError } from '../../../../../shared/exceptions/invalid-argument.error';

export class CheckInUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(input: CheckInUserDto): Promise<User> {
    const { identifier } = input;

    let user: User | null = null;

    if (Email.isValid(identifier)) {
      const emailVO: Email = Email.create(identifier);
      user = await this.userRepository.findByEmail(emailVO);
    } else if (Username.isValid(identifier)) {
      const usernameVO: Username = Username.create(identifier);
      user = await this.userRepository.findByUsername(usernameVO);
    } else {
      throw new InvalidArgumentError('Invalid identifier');
    }

    if (!user) {
      throw new UserNotExistsError('User not found for provided identifier');
    }

    return user;
  }
}
