import { UserRepositoryPort } from '../ports/out/user-repository.port';
import { ValidateUserDto } from '../dto/validate-user.dto';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { EntityNotFoundError } from '../../../../shared/exceptions/entity-not-found.error';
import { UserStatus } from '../../domain/value-objects/user-status.vo';
import { InvalidArgumentError } from '../../../../shared/exceptions/invalid-argument.error';
import { UnauthorizedError } from '../../../../shared/exceptions/unauthorized.error';
import { ValidateUserPort } from '../ports/in/validate-user.port';

export class ValidateUserUseCase implements ValidateUserPort {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(input: ValidateUserDto): Promise<boolean> {
    const { id, code } = input;

    const userIdVO: UserId = UserId.create(id);

    const user = await this.userRepository.findById(userIdVO);

    if (!user) {
      throw new EntityNotFoundError('User not found');
    }

    if (!user.status.equals(UserStatus.create('pending'))) {
      throw new InvalidArgumentError('User is not in status pending');
    }

    if (user.authCode !== code) {
      throw new UnauthorizedError('Invalid code');
    }

    user.activate();
    await this.userRepository.save(user);

    return true;
  }
}
