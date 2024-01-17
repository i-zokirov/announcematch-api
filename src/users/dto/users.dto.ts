import { Expose, Type } from 'class-transformer';
import { User } from '../entities/user.entity';
import { UserDto } from './user.dto';

export class UsersDto {
  @Expose()
  totalCount: number;
  @Expose()
  page: number;
  @Expose()
  limit: number;
  @Expose()
  @Type(() => UserDto)
  data: User[];
}
