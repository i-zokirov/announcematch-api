import { Expose, Type } from 'class-transformer';
import { UserDto } from 'src/users/dto/user.dto';

export class PorposalDto {
  @Expose()
  id: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  durationType: string;
  @Expose()
  duration: number;

  @Expose()
  @Type(() => UserDto)
  createdBy: UserDto;

  @Expose()
  announcement: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
