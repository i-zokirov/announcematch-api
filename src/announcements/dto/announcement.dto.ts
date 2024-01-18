import { Expose, Type } from 'class-transformer';
import { CategoryDto } from 'src/categories/dto/category.dto';
import { UserDto } from 'src/users/dto/user.dto';

export class AnnouncementDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  status: string;

  @Expose()
  image: string;

  @Expose()
  expiresAt: string;

  @Expose()
  archivedAt: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  @Type(() => UserDto)
  createdBy: UserDto;

  @Expose()
  @Type(() => CategoryDto)
  categories: CategoryDto[];
}
