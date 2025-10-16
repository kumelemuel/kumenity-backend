import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CreateUserUseCase } from '@application/identity-access/ports/use-cases/create-user.usecase';

@Controller('auth')
export class AuthController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post('sign-up')
  async signUp(
    @Body() body: { email: string; password: string },
  ): Promise<any> {
    const { email, password } = body;

    const user = await this.createUserUseCase.execute({ email, password });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: {
        id: user.id.value,
        email: user.email.value,
      },
    };
  }
}
