import { User } from '@domain/identity-access/entities/user.entity';
import { CreateUserUseCase } from '@application/identity-access/ports/inbound/create-user.usecase';
import { UserRepositoryPort } from '@application/identity-access/ports/outbound/user-repository.port';
import { InvalidArgumentError } from '@domain/shared/exceptions/invalid-argument.error';
import { UserAlreadyExistsError } from '@domain/identity-access/exceptions/user-alredy-exists.error';
import { HashGeneratorPort } from '@application/identity-access/ports/outbound/hash-generator.port';

const mockUserRepository = (): jest.Mocked<UserRepositoryPort> => ({
  save: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByUsername: jest.fn(),
});

const mockHashGenerator = (): jest.Mocked<HashGeneratorPort> => ({
  generate: jest.fn(),
});

const valid_password =
  '$2a$12$DIvmJUDVluP4xvSgJLSNxukhXU1TcFpp.exoMiIcJXvKCRSy33gI6';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let repo: jest.Mocked<UserRepositoryPort>;
  let hashGenerator: jest.Mocked<HashGeneratorPort>;

  beforeEach(() => {
    repo = mockUserRepository();
    hashGenerator = mockHashGenerator();
    useCase = new CreateUserUseCase(repo, hashGenerator);
  });

  it('must be launched InvalidArgumentError if the email is invalid', async () => {
    await expect(
      useCase.execute({
        email: 'not-an-email',
        username: 'test.user',
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(InvalidArgumentError);
  });

  it('must be launched InvalidArgumentError if the password is invalid', async () => {
    await expect(
      useCase.execute({
        email: 'not-an-email',
        username: 'test.user',
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(InvalidArgumentError);
  });

  it('must be launched InvalidArgumentError if the username is invalid', async () => {
    await expect(
      useCase.execute({
        email: 'user@example.com',
        username: 'test',
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(InvalidArgumentError);
  });

  it('must be launched UserAlreadyExistsError if the email already exists', async () => {
    const validEmail = 'user@example.com';
    repo.findByEmail.mockResolvedValueOnce({} as User);
    hashGenerator.generate.mockResolvedValueOnce(valid_password);

    await expect(
      useCase.execute({
        email: validEmail,
        username: 'test.user',
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it('must be launched UserAlreadyExistsError if the username already exists', async () => {
    repo.findByUsername.mockResolvedValueOnce({} as User);
    hashGenerator.generate.mockResolvedValueOnce(valid_password);

    await expect(
      useCase.execute({
        email: 'user@example.com',
        username: 'test.user',
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it('must be create and save successfully an user if all its good', async () => {
    const validEmail = 'newuser@example.com';
    const validUsername = 'test.user';
    repo.findByEmail.mockResolvedValueOnce(null);
    repo.findByUsername.mockResolvedValueOnce(null);
    hashGenerator.generate.mockResolvedValueOnce(valid_password);

    const result = await useCase.execute({
      email: validEmail,
      username: validUsername,
      password: '123456789',
    });

    expect(result).toBeInstanceOf(User);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(result.props.email.value).toBe(validEmail);
    expect(result.props.username.value).toBe(validUsername);
    expect(result.props.status.value).toBe('pending');
    expect(result.props.authCode).not.toBeNull();
  });
});
