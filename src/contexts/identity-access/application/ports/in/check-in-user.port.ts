import { CheckInUserDto } from '../../dto/check-in-user.dto';
import { User } from '../../../domain/entities/user.entity';

export interface CheckInUserPort {
  execute(input: CheckInUserDto): Promise<User>;
}
