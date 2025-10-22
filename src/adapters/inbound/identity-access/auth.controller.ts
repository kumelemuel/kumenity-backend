import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CreateUserUseCase } from '@application/identity-access/ports/inbound/create-user.usecase';
import { CheckInUserUseCase } from '@application/identity-access/ports/inbound/check-in-user.usecase';
import { ValidateUserUseCase } from '@application/identity-access/ports/inbound/validate-user.usecase';

@Controller('auth')
class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly checkInUserUseCase: CheckInUserUseCase,
    private readonly validateUserUseCase: ValidateUserUseCase,
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
        status: user.status.value,
      },
    };
  }

  @Post('check-in')
  async checkIn(@Body() body: { identifier: string }): Promise<any> {
    const { identifier } = body;

    const user = await this.checkInUserUseCase.execute({ identifier });

    return {
      statusCode: HttpStatus.FOUND,
      message: 'User found successfully',
      data: {
        id: user.id.value,
        username: user.username.value,
        email: user.email.value,
        status: user.status.value,
      },
    };
  }

  @Post('validate-user')
  async validateUser(@Body() body: { id: string; code: number }): Promise<any> {
    const { id, code } = body;

    await this.validateUserUseCase.execute({ id, code });

    return {
      statusCode: HttpStatus.FOUND,
      message: 'User found successfully',
      data: {
        status: 'active',
      },
    };
  }
}

export default AuthController;
