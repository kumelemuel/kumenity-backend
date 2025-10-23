import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../../../domain/entities/user.entity';

export interface CreateUserPort {
  execute(input: CreateUserDto): Promise<User>;
}
