import { User } from '@domain/identity-access/entities/user.entity';
import { Email } from '@domain/identity-access/value-objects/email.vo';
import { UserId } from '@domain/identity-access/value-objects/user-id.vo';
import { UserAlreadyExistsError } from '@domain/identity-access/exceptions/user-alredy-exists.error';
import { UserRepositoryPort } from '@application/identity-access/ports/outbound/user-repository.port';
import { CreateUserDto } from '@application/identity-access/dto/create-user.dto';
import { UserStatus } from '@domain/identity-access/value-objects/user-status.vo';
import { Username } from '@domain/identity-access/value-objects/username.vo';
import { Password } from '@domain/identity-access/value-objects/password.vo';
import { HashGeneratorPort } from '@application/identity-access/ports/outbound/hash-generator.port';
import { InvalidArgumentError } from '@domain/shared/exceptions/invalid-argument.error';

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly hashGenerator: HashGeneratorPort,
  ) {}

  async execute(input: CreateUserDto): Promise<User> {
    const { email, username, password } = input;

    if (password.length < 8) {
      throw new InvalidArgumentError(
        'Password must be at least 8 characters long',
      );
    }

    const emailVO: Email = Email.create(email);
    const usernameVO: Username = Username.create(username);
    const passwordVO: Password = Password.create(
      await this.hashGenerator.generate(password),
    );

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
      password: passwordVO,
      status: UserStatus.create('pending'),
      authCode: Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date(),
    });

    await this.userRepository.save(user);
    return user;
  }
}
