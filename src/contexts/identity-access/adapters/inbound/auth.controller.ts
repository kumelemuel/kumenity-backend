import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import type { CreateUserPort } from '../../application/ports/in/create-user.port';
import type { CheckInUserPort } from '../../application/ports/in/check-in-user.port';
import type { ValidateUserPort } from '../../application/ports/in/validate-user.port';
import type { SignInUserPort } from '../../application/ports/in/sign-in-user.port';
import { TOKENS } from '@infrastructure/tokens/tokens';

@Controller('auth')
class AuthController {
  constructor(
    @Inject(TOKENS.CREATE_USER_PORT)
    private readonly createUserUseCase: CreateUserPort,
    @Inject(TOKENS.CHECK_IN_USER_PORT)
    private readonly checkInUserUseCase: CheckInUserPort,
    @Inject(TOKENS.VALIDATE_USER_PORT)
    private readonly validateUserUseCase: ValidateUserPort,
    @Inject(TOKENS.SIGN_IN_USER_PORT)
    private readonly signInUserPort: SignInUserPort,
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
        username: user.username.value,
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
        username: user.username.value,
        status: user.status.value,
      },
    };
  }

  @Post('validate-user')
  async validateUser(
    @Body() body: { username: string; code: number },
  ): Promise<any> {
    const { username, code } = body;

    await this.validateUserUseCase.execute({ username, code });

    return {
      statusCode: HttpStatus.OK,
      message: 'User validated successfully',
      data: {
        status: 'active',
      },
    };
  }

  @Post('sign-in')
  async signIn(
    @Body() body: { username: string; password: string },
  ): Promise<any> {
    const { username, password } = body;

    const token = await this.signInUserPort.execute({ username, password });

    return {
      statusCode: HttpStatus.OK,
      message: 'User signed in successfully',
      data: {
        token,
      },
    };
  }
}

export default AuthController;
