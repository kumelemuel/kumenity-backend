import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserUseCase } from '@application/identity-access/use-cases/create-user.usecase';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async createUser(
    @Body() body: { email: string; password: string },
  ): Promise<any> {
    const { email, password } = body;

    const user = await this.createUserUseCase.execute({ email, password });

    return {
      id: user.id.value,
      email: user.email.value,
    };
  }
}
