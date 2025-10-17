import { User } from '@domain/identity-access/entities/user.entity';
import { CreateUserUseCase } from '@application/identity-access/ports/use-cases/create-user.usecase';
import { UserRepositoryPort } from '@application/identity-access/ports/repositories/user-repository.port';
import { InvalidArgumentError } from '@domain/shared/exceptions/invalid-argument.error';
import { UserAlreadyExistsError } from '@domain/identity-access/exceptions/user-alredy-exists.error';

const mockUserRepository = (): jest.Mocked<UserRepositoryPort> => ({
  save: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByUsername: jest.fn(),
});

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let repo: jest.Mocked<UserRepositoryPort>;

  beforeEach(() => {
    repo = mockUserRepository();
    useCase = new CreateUserUseCase(repo);
  });

  it('must be launched InvalidArgumentError if the email is invalid', async () => {
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
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(InvalidArgumentError);
  });

  it('must be launched UserAlreadyExistsError if the email already exists', async () => {
    const validEmail = 'user@example.com';
    repo.findByEmail.mockResolvedValueOnce({} as User);

    await expect(
      useCase.execute({
        email: validEmail,
        username: 'test.user',
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it('must be launched UserAlreadyExistsError if the username already exists', async () => {
    repo.findByEmail.mockResolvedValueOnce({} as User);

    await expect(
      useCase.execute({
        email: 'user@example.com',
        username: 'test.user',
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it('must be create and save successfully an user if all its good', async () => {
    const validEmail = 'newuser@example.com';
    const validUsername = 'test.user';
    repo.findByEmail.mockResolvedValueOnce(null);

    const result = await useCase.execute({
      email: validEmail,
      username: validUsername,
      password: '1234',
    });

    expect(result).toBeInstanceOf(User);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(result.props.email.value).toBe(validEmail);
    expect(result.props.username.value).toBe(validUsername);
  });
});
