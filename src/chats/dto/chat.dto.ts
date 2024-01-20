import { Expose, Type } from 'class-transformer';
import { AnnouncementDto } from 'src/announcements/dto/announcement.dto';
import { UserDto } from 'src/users/dto/user.dto';

export class ChatDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  @Type(() => UserDto)
  createdBy: UserDto;

  @Expose()
  @Type(() => UserDto)
  participants: UserDto[];

  @Expose()
  @Type(() => AnnouncementDto)
  announcement: AnnouncementDto;

  @Expose()
  status: string;

  @Expose()
  updatedAt: Date;

  @Expose()
  createdAt: Date;
}
