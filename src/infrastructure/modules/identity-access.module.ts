import { Module } from '@nestjs/common';
import { InMemoryUserRepository } from '@adapters/outbound/identity-access/in-memory-user.repository';
import { CreateUserUseCase } from '@application/identity-access/ports/inbound/create-user.usecase';
import { UserRepositoryPort } from '@application/identity-access/ports/outbound/user-repository.port';
import AuthController from '@adapters/inbound/identity-access/auth.controller';
import { CheckInUserUseCase } from '@application/identity-access/ports/inbound/check-in-user.usecase';
import { HashGeneratorAdapter } from '@adapters/inbound/identity-access/hash-generator.adapter';
import { HashGeneratorPort } from '@application/identity-access/ports/outbound/hash-generator.port';

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
  ],
  exports: [CreateUserUseCase, CheckInUserUseCase],
})
export class IdentityAccessModule {}
