import { UserRepositoryPort } from '../ports/out/user-repository.port';
import { SignInUserUsecase } from '../use-cases/sign-in-user.usecase';
import { HashGeneratorPort } from '../ports/out/hash-generator.port';
import { TokenGeneratorPort } from '../ports/out/token-generator.port';
import { UserNotExistsError } from '../../domain/exceptions/user-not-exists.error';
import { UnauthorizedError } from '../../../../shared/exceptions/unauthorized.error';
import { User } from '../../domain/entities/user.entity';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { Username } from '../../domain/value-objects/username.vo';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { UserStatus } from '../../domain/value-objects/user-status.vo';

const mockUserRepository = (): jest.Mocked<UserRepositoryPort> => ({
  save: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByUsername: jest.fn(),
});

const mockHashGenerator = (): jest.Mocked<HashGeneratorPort> => ({
  generate: jest.fn(),
  compare: jest.fn(),
});

const mockTokenGenerator = (): jest.Mocked<TokenGeneratorPort> => ({
  sign: jest.fn(),
  verify: jest.fn(),
});

const valid_password =
  '$2a$12$DIvmJUDVluP4xvSgJLSNxukhXU1TcFpp.exoMiIcJXvKCRSy33gI6';

describe('SignInUserUsecase', () => {
  let useCase: SignInUserUsecase;
  let repo: jest.Mocked<UserRepositoryPort>;
  let hashGenerator: jest.Mocked<HashGeneratorPort>;
  let tokenGenerator: jest.Mocked<TokenGeneratorPort>;

  beforeEach(() => {
    repo = mockUserRepository();
    hashGenerator = mockHashGenerator();
    tokenGenerator = mockTokenGenerator();
    useCase = new SignInUserUsecase(repo, hashGenerator, tokenGenerator);
  });

  it('must be throw UserNotExistsError if username not found', async () => {
    repo.findByUsername.mockResolvedValueOnce(null);

    await expect(
      useCase.execute({
        username: 'user.test',
        password: valid_password,
      }),
    ).rejects.toBeInstanceOf(UserNotExistsError);
  });

  it('must be throw UnauthorizedError if user is not active', async () => {
    const existingUser = User.create({
      id: UserId.create(),
      username: Username.create('test.user'),
      email: Email.create('newuser@example.com'),
      password: Password.create(valid_password),
      createdAt: new Date(),
      authCode: null,
      status: UserStatus.create('banned'),
    });

    repo.findByUsername.mockResolvedValueOnce(existingUser);
    hashGenerator.compare.mockResolvedValueOnce(true);

    await expect(
      useCase.execute({
        username: 'test.user',
        password: valid_password,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('must be throw UnauthorizedError if user password is not correct', async () => {
    const existingUser = User.create({
      id: UserId.create(),
      username: Username.create('test.user'),
      email: Email.create('newuser@example.com'),
      password: Password.create(valid_password),
      createdAt: new Date(),
      authCode: null,
      status: UserStatus.create('banned'),
    });

    repo.findByUsername.mockResolvedValueOnce(existingUser);
    hashGenerator.compare.mockResolvedValueOnce(false);
    await expect(
      useCase.execute({
        username: 'user.test',
        password: valid_password,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('must be return an token string if user and password are correct', async () => {
    const existingUser = User.create({
      id: UserId.create(),
      username: Username.create('test.user'),
      email: Email.create('newuser@example.com'),
      password: Password.create(valid_password),
      createdAt: new Date(),
      authCode: null,
      status: UserStatus.create('active'),
    });

    repo.findByUsername.mockResolvedValueOnce(existingUser);
    hashGenerator.compare.mockResolvedValueOnce(true);
    tokenGenerator.sign.mockReturnValueOnce('valid-token');

    expect(
      await useCase.execute({
        username: 'user.test',
        password: valid_password,
      }),
    ).toBe('valid-token');
  });
});
