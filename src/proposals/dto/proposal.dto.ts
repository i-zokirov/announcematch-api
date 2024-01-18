import { Expose, Type } from 'class-transformer';
import { AnnouncementDto } from 'src/announcements/dto/announcement.dto';
import { ProposalStatus } from 'src/types/enums';
import { UserDto } from 'src/users/dto/user.dto';

export class PorposalDto {
  @Expose()
  id: string;

  @Expose()
  description: string;

  @Expose()
  price: number;
  @Expose()
  status: ProposalStatus;

  @Expose()
  durationType: string;

  @Expose()
  duration: number;

  @Expose()
  @Type(() => UserDto)
  createdBy: UserDto;

  @Expose()
  @Type(() => AnnouncementDto)
  announcement: AnnouncementDto;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
