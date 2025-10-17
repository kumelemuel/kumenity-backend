import { User } from '@domain/identity-access/entities/user.entity';
import { UserRepositoryPort } from '@application/identity-access/ports/repositories/user-repository.port';
import { CheckInUserUseCase } from '@application/identity-access/ports/use-cases/check-in-user.usecase';
import { Email } from '@domain/identity-access/value-objects/email.vo';
import { UserId } from '@domain/identity-access/value-objects/user-id.vo';
import { Username } from '@domain/identity-access/value-objects/username.vo';
import { UserStatus } from '@domain/identity-access/value-objects/user-status.vo';
import { InvalidArgumentError } from '@domain/shared/exceptions/invalid-argument.error';
import { UserNotExistsError } from '@domain/identity-access/exceptions/user-not-exists.error';

const mockUserRepository = (): jest.Mocked<UserRepositoryPort> => ({
  save: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByUsername: jest.fn(),
});

describe('CheckInUserUseCase', () => {
  let useCase: CheckInUserUseCase;
  let repo: jest.Mocked<UserRepositoryPort>;

  beforeEach(() => {
    repo = mockUserRepository();
    useCase = new CheckInUserUseCase(repo);
  });

  it('must be throw InvalidArgumentError if is an invalid email and invalid username', async () => {
    await expect(
      useCase.execute({
        identifier: 'test',
      }),
    ).rejects.toBeInstanceOf(InvalidArgumentError);
  });

  it('must be launched UserNotExistsError if the email is not registered', async () => {
    repo.findByEmail.mockResolvedValueOnce(null);

    await expect(
      useCase.execute({ identifier: 'user@example.com' }),
    ).rejects.toBeInstanceOf(UserNotExistsError);
  });

  it('must be launched UserNotExistsError if the username is not registered', async () => {
    repo.findByUsername.mockResolvedValueOnce(null);

    await expect(
      useCase.execute({ identifier: 'username' }),
    ).rejects.toBeInstanceOf(UserNotExistsError);
  });

  it('must be return an user if the email exists', async () => {
    const validEmail = 'newuser@example.com';
    const existingUser = User.create({
      id: UserId.create(),
      username: Username.create('test.user'),
      email: Email.create(validEmail),
      createdAt: new Date(),
      status: UserStatus.create('pending'),
    });

    repo.findByEmail.mockResolvedValueOnce(existingUser);

    const result = await useCase.execute({
      identifier: validEmail,
    });

    expect(result).toBeInstanceOf(User);
    expect(result?.props.email.value).toBe(validEmail);
  });

  it('must be return an user if the username exists', async () => {
    const validUsername = 'test.user';
    const existingUser = User.create({
      id: UserId.create(),
      username: Username.create(validUsername),
      email: Email.create('newuser@example.com'),
      createdAt: new Date(),
      status: UserStatus.create('pending'),
    });

    repo.findByUsername.mockResolvedValueOnce(existingUser);

    const result = await useCase.execute({
      identifier: validUsername,
    });

    expect(result).toBeInstanceOf(User);
    expect(result?.props.username.value).toBe(validUsername);
  });

  it('must be throw UserNotExistsError if the e-mail and username not exists', async () => {
    repo.findByEmail.mockResolvedValueOnce(null);
    repo.findByUsername.mockResolvedValueOnce(null);
    await expect(
      useCase.execute({
        identifier: 'test.user',
      }),
    ).rejects.toBeInstanceOf(UserNotExistsError);
  });
});
