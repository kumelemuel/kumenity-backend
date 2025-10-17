import { User } from '@domain/identity-access/entities/user.entity';
import { Email } from '@domain/identity-access/value-objects/email.vo';
import { UserId } from '@domain/identity-access/value-objects/user-id.vo';
import { UserAlreadyExistsError } from '@domain/identity-access/exceptions/user-alredy-exists.error';
import { UserRepositoryPort } from '@application/identity-access/ports/repositories/user-repository.port';
import { CreateUserDto } from '@application/identity-access/dto/create-user.dto';
import { UserStatus } from '@domain/identity-access/value-objects/user-status.vo';
import { Username } from '@domain/identity-access/value-objects/username.vo';

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(input: CreateUserDto): Promise<User> {
    const { email, username } = input;

    const emailVO: Email = Email.create(email);
    const usernameVO: Username = Username.create(username);

    const existingEmail = await this.userRepository.findByEmail(emailVO);
    if (existingEmail) {
      throw new UserAlreadyExistsError(
        `User already exists with email: ${emailVO.value}`,
      );
    }

    const existingUsername =
      await this.userRepository.findByUsername(usernameVO);
    if (existingUsername) {
      throw new UserAlreadyExistsError(
        `User already exists with username: ${usernameVO.value}`,
      );
    }

    const user = User.create({
      id: UserId.create(),
      email: emailVO,
      username: usernameVO,
      status: UserStatus.create('pending'),
      createdAt: new Date(),
    });

    await this.userRepository.save(user);
    return user;
  }
}
