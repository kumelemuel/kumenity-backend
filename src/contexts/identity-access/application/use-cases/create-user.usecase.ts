import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { UserAlreadyExistsError } from '../../domain/exceptions/user-alredy-exists.error';
import { UserRepositoryPort } from '../ports/out/user-repository.port';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserStatus } from '../../domain/value-objects/user-status.vo';
import { Username } from '../../domain/value-objects/username.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { HashGeneratorPort } from '../ports/out/hash-generator.port';
import { InvalidArgumentError } from '../../../../shared/exceptions/invalid-argument.error';
import { CreateUserPort } from '../ports/in/create-user.port';

export class CreateUserUseCase implements CreateUserPort {
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
