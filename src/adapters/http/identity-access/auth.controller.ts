import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CreateUserUseCase } from '@application/identity-access/ports/use-cases/create-user.usecase';
import { CheckInUserUseCase } from '@application/identity-access/ports/use-cases/check-in-user.usecase';

@Controller('auth')
class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly checkInUserUseCase: CheckInUserUseCase,
  ) {}

  @Post('sign-up')
  async signUp(
    @Body() body: { email: string; username: string; password: string },
  ): Promise<any> {
    const { email, username, password } = body;

    const user = await this.createUserUseCase.execute({
      email,
      username,
      password,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: {
        id: user.id.value,
        username: user.username.value,
        email: user.email.value,
      },
    };
  }

  @Post('check-in')
  async checkIn(@Body() body: { identifier: string }): Promise<any> {
    const { identifier } = body;

    const user = await this.checkInUserUseCase.execute({ identifier });

    return {
      statusCode: HttpStatus.OK,
      message: 'User found successfully',
      data: {
        id: user.id.value,
        username: user.username.value,
        email: user.email.value,
      },
    };
  }
}

export default AuthController;
