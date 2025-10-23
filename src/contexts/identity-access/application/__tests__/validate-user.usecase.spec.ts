import { UserRepositoryPort } from '../ports/out/user-repository.port';
import { InvalidArgumentError } from '../../../../shared/exceptions/invalid-argument.error';
import { ValidateUserUseCase } from '../use-cases/validate-user.usecase';
import { EntityNotFoundError } from '../../../../shared/exceptions/entity-not-found.error';
import { User } from '../../domain/entities/user.entity';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { Username } from '../../domain/value-objects/username.vo';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { UserStatus } from '../../domain/value-objects/user-status.vo';
import { UnauthorizedError } from '../../../../shared/exceptions/unauthorized.error';

const mockUserRepository = (): jest.Mocked<UserRepositoryPort> => ({
  save: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByUsername: jest.fn(),
});

const valid_password =
  '$2a$12$DIvmJUDVluP4xvSgJLSNxukhXU1TcFpp.exoMiIcJXvKCRSy33gI6';

describe('ValidateUserUseCase', () => {
  let useCase: ValidateUserUseCase;
  let repo: jest.Mocked<UserRepositoryPort>;

  beforeEach(() => {
    repo = mockUserRepository();
    useCase = new ValidateUserUseCase(repo);
  });

  it('must be launched InvalidArgumentError if the user ID is invalid', async () => {
    await expect(
      useCase.execute({
        id: '1414141',
        code: 123456,
      }),
    ).rejects.toBeInstanceOf(InvalidArgumentError);
  });

  it('must be launched EntityNotFoundError if the user ID not exists', async () => {
    repo.findById.mockResolvedValueOnce(null);

    await expect(
      useCase.execute({
        id: 'c52de6fa-397e-4de1-9f64-8c911291ff66',
        code: 123456,
      }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it('must be launched InvalidArgumentError if the user ID exists but not have a status pending', async () => {
    const existingUser = User.create({
      id: UserId.create(),
      username: Username.create('test.user'),
      email: Email.create('newuser@example.com'),
      password: Password.create(valid_password),
      createdAt: new Date(),
      authCode: 123456,
      status: UserStatus.create('banned'),
    });

    repo.findById.mockResolvedValueOnce(existingUser);

    await expect(
      useCase.execute({
        id: 'c52de6fa-397e-4de1-9f64-8c911291ff66',
        code: 123456,
      }),
    ).rejects.toBeInstanceOf(InvalidArgumentError);
  });

  it('must be launched UnauthorizedError if the user ID exists and have a status pending, but the code es invalid', async () => {
    const existingUser = User.create({
      id: UserId.create(),
      username: Username.create('test.user'),
      email: Email.create('newuser@example.com'),
      password: Password.create(valid_password),
      createdAt: new Date(),
      authCode: 123456,
      status: UserStatus.create('pending'),
    });

    repo.findById.mockResolvedValueOnce(existingUser);

    await expect(
      useCase.execute({
        id: 'c52de6fa-397e-4de1-9f64-8c911291ff66',
        code: 654321,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
