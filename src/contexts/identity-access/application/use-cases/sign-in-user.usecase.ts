import { UserRepositoryPort } from '../ports/out/user-repository.port';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { UserStatus } from '../../domain/value-objects/user-status.vo';
import { SignInUserPort } from '../ports/in/sign-in-user.port';
import { SignInUserDto } from '../dto/sign-in-user.dto';
import { Username } from '../../domain/value-objects/username.vo';
import { UserNotExistsError } from '../../domain/exceptions/user-not-exists.error';
import { TokenGeneratorPort } from '../ports/out/token-generator.port';
import { HashGeneratorPort } from '../ports/out/hash-generator.port';
import { UnauthorizedError } from '../../../../shared/exceptions/unauthorized.error';

export class SignInUserUsecase implements SignInUserPort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly hashGeneratorPort: HashGeneratorPort,
    private readonly tokenGenerator: TokenGeneratorPort,
  ) {}

  async execute(input: SignInUserDto): Promise<string> {
    const { username, password } = input;

    const userNameVO: UserId = Username.create(username);

    const user = await this.userRepository.findByUsername(userNameVO);

    if (!user) {
      throw new UserNotExistsError('User not found');
    }

    if (!user.status.equals(UserStatus.create('active'))) {
      throw new UnauthorizedError('User is not active');
    }

    if (
      !(await this.hashGeneratorPort.compare(password, user.password.value))
    ) {
      throw new UnauthorizedError('Invalid password');
    }

    return this.tokenGenerator.sign({
      id: user.id.value,
      username: user.username.value,
    });
  }
}
