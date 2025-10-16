import { Module } from '@nestjs/common';
import { InMemoryUserRepository } from '@adapters/persistence/identity-access/in-memory-user.repository';
import { CreateUserUseCase } from '@application/identity-access/ports/use-cases/create-user.usecase';
import { UserRepositoryPort } from '@application/identity-access/ports/repositories/user-repository.port';
import { AuthController } from '@adapters/http/identity-access/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: InMemoryUserRepository,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (repo: UserRepositoryPort) => new CreateUserUseCase(repo),
      inject: ['IUserRepository'],
    },
  ],
  exports: [CreateUserUseCase],
})
export class IdentityAccessModule {}
