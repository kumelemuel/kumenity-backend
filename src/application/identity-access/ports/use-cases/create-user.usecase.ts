import { User } from '@domain/identity-access/entities/user.entity';
import { Email } from '@domain/identity-access/value-objects/email.vo';
import { UserId } from '@domain/identity-access/value-objects/user-id.vo';
import { UserAlreadyExistsError } from '@domain/identity-access/exceptions/user-alredy-exists.error';
import { UserRepositoryPort } from '@application/identity-access/ports/repositories/user-repository.port';
import { CreateUserDto } from '@application/identity-access/dto/create-user.dto';

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(input: CreateUserDto): Promise<User> {
    const { email } = input;

    const emailVO: Email = Email.create(email);

    const existing = await this.userRepository.findByEmail(emailVO.value);
    if (existing) {
      throw new UserAlreadyExistsError(emailVO.value);
    }

    const user = User.create({
      id: UserId.create(),
      email: emailVO,
      createdAt: new Date(),
    });

    await this.userRepository.save(user);
    return user;
  }
}
