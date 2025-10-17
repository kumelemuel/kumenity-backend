import { Module } from '@nestjs/common';
import { InMemoryUserRepository } from '@adapters/persistence/identity-access/in-memory-user.repository';
import { CreateUserUseCase } from '@application/identity-access/ports/use-cases/create-user.usecase';
import { UserRepositoryPort } from '@application/identity-access/ports/repositories/user-repository.port';
import AuthController from '@adapters/http/identity-access/auth.controller';
import { CheckInUserUseCase } from '@application/identity-access/ports/use-cases/check-in-user.usecase';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: InMemoryUserRepository,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (repo: UserRepositoryPort) => new CreateUserUseCase(repo),
      inject: ['UserRepository'],
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
