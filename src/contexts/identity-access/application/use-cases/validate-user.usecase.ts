import { UserRepositoryPort } from '../ports/out/user-repository.port';
import { ValidateUserDto } from '../dto/validate-user.dto';
import { EntityNotFoundError } from '../../../../shared/exceptions/entity-not-found.error';
import { UserStatus } from '../../domain/value-objects/user-status.vo';
import { UnauthorizedError } from '../../../../shared/exceptions/unauthorized.error';
import { ValidateUserPort } from '../ports/in/validate-user.port';
import { Username } from '../../domain/value-objects/username.vo';

export class ValidateUserUseCase implements ValidateUserPort {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(input: ValidateUserDto): Promise<boolean> {
    const { username, code } = input;

    const usernameVO: Username = Username.create(username);

    const user = await this.userRepository.findByUsername(usernameVO);

    if (!user) {
      throw new EntityNotFoundError('User not found');
    }

    if (!user.status.equals(UserStatus.create('pending'))) {
      throw new UnauthorizedError('User is not in status pending');
    }

    if (user.authCode != code) {
      throw new UnauthorizedError('Invalid code');
    }

    user.activate();
    await this.userRepository.save(user);

    return true;
  }
}
