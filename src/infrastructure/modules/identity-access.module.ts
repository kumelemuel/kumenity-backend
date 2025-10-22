import { Module } from '@nestjs/common';
import { InMemoryUserRepository } from '../../contexts/identity-access/adapters/outbound/in-memory-user.repository';
import { CreateUserUseCase } from '../../contexts/identity-access/application/ports/inbound/create-user.usecase';
import { UserRepositoryPort } from '../../contexts/identity-access/application/ports/outbound/user-repository.port';
import AuthController from '../../contexts/identity-access/adapters/inbound/auth.controller';
import { CheckInUserUseCase } from '../../contexts/identity-access/application/ports/inbound/check-in-user.usecase';
import { HashGeneratorAdapter } from '../../contexts/identity-access/adapters/inbound/hash-generator.adapter';
import { HashGeneratorPort } from '../../contexts/identity-access/application/ports/outbound/hash-generator.port';
import { ValidateUserUseCase } from '../../contexts/identity-access/application/ports/inbound/validate-user.usecase';

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
      provide: CreateUserUseCase,
      useFactory: (
        repo: UserRepositoryPort,
        hashGenerator: HashGeneratorPort,
      ) => new CreateUserUseCase(repo, hashGenerator),
      inject: ['UserRepository', 'HashGenerator'],
    },
    {
      provide: CheckInUserUseCase,
      useFactory: (repo: UserRepositoryPort) => new CheckInUserUseCase(repo),
      inject: ['UserRepository'],
    },
    {
      provide: ValidateUserUseCase,
      useFactory: (repo: UserRepositoryPort) => new ValidateUserUseCase(repo),
      inject: ['UserRepository'],
    },
  ],
  exports: [CreateUserUseCase, CheckInUserUseCase],
})
export class IdentityAccessModule {}
