import { Module } from '@nestjs/common';
import { InMemoryUserRepository } from '@adapters/persistence/identity-access/in-memory-user.repository';
import { CreateUserUseCase } from '@application/identity-access/use-cases/create-user.usecase';
import { UserRepositoryPort } from '@application/identity-access/ports/user-repository.port';
import { UserController } from '@adapters/http/identity-access/user.controller';

@Module({
  controllers: [UserController],
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
