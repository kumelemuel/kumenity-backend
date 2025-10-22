import { UserRepositoryPort } from '@application/identity-access/ports/outbound/user-repository.port';
import { ValidateUserDto } from '@application/identity-access/dto/validate-user.dto';
import { UserId } from '@domain/identity-access/value-objects/user-id.vo';
import { EntityNotFoundError } from '@domain/shared/exceptions/entity-not-found.error';
import { UserStatus } from '@domain/identity-access/value-objects/user-status.vo';
import { InvalidArgumentError } from '@domain/shared/exceptions/invalid-argument.error';
import { UnauthorizedError } from '@domain/shared/exceptions/unauthorized.error';

export class ValidateUserUseCase {
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
