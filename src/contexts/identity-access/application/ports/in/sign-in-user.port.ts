import { SignInUserDto } from '../../dto/sign-in-user.dto';

export interface SignInUserPort {
  execute(input: SignInUserDto): Promise<string>;
}
