import { ValidateUserDto } from '../../dto/validate-user.dto';

export interface ValidateUserPort {
  execute(input: ValidateUserDto): Promise<boolean>;
}
