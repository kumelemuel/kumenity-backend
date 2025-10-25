import { Module } from '@nestjs/common';
import { InMemoryUserRepository } from '../../contexts/identity-access/adapters/outbound/in-memory-user.repository';
import { CreateUserUseCase } from '../../contexts/identity-access/application/use-cases/create-user.usecase';
import { UserRepositoryPort } from '../../contexts/identity-access/application/ports/out/user-repository.port';
import AuthController from '../../contexts/identity-access/adapters/inbound/auth.controller';
import { CheckInUserUseCase } from '../../contexts/identity-access/application/use-cases/check-in-user.usecase';
import { HashGeneratorAdapter } from '../../contexts/identity-access/adapters/inbound/hash-generator.adapter';
import { HashGeneratorPort } from '../../contexts/identity-access/application/ports/out/hash-generator.port';
import { ValidateUserUseCase } from '../../contexts/identity-access/application/use-cases/validate-user.usecase';
import { TOKENS } from '@infrastructure/tokens/tokens';
import { JwtTokenGeneratorAdapter } from '../../contexts/identity-access/adapters/inbound/token-generator.adapter';
import { SignInUserUsecase } from '../../contexts/identity-access/application/use-cases/sign-in-user.usecase';
import { TokenGeneratorPort } from '../../contexts/identity-access/application/ports/out/token-generator.port';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: InMemoryUserRepository,
    },
    {
      provide: 'HashGenerator',
      useClass: HashGeneratorAdapter,
    },
    {
      provide: 'TokenGenerator',
      useClass: JwtTokenGeneratorAdapter,
    },
    {
      provide: TOKENS.CREATE_USER_PORT,
      useFactory: (
        repo: UserRepositoryPort,
        hashGenerator: HashGeneratorPort,
      ) => new CreateUserUseCase(repo, hashGenerator),
      inject: ['UserRepository', 'HashGenerator'],
    },
    {
      provide: TOKENS.CHECK_IN_USER_PORT,
      useFactory: (repo: UserRepositoryPort) => new CheckInUserUseCase(repo),
      inject: ['UserRepository'],
    },
    {
      provide: TOKENS.VALIDATE_USER_PORT,
      useFactory: (repo: UserRepositoryPort) => new ValidateUserUseCase(repo),
      inject: ['UserRepository'],
    },
    {
      provide: TOKENS.SIGN_IN_USER_PORT,
      useFactory: (
        repo: UserRepositoryPort,
        hashGenerator: HashGeneratorPort,
        tokenGenerator: TokenGeneratorPort,
      ) => new SignInUserUsecase(repo, hashGenerator, tokenGenerator),
      inject: ['UserRepository', 'HashGenerator', 'TokenGenerator'],
    },
  ],
  exports: [
    TOKENS.CREATE_USER_PORT,
    TOKENS.CHECK_IN_USER_PORT,
    TOKENS.VALIDATE_USER_PORT,
    TOKENS.SIGN_IN_USER_PORT,
  ],
})
export class IdentityAccessModule {}
