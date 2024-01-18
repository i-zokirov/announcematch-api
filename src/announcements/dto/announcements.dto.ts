import { Expose, Type } from 'class-transformer';
import { AnnouncementDto } from './announcement.dto';

export class AnnouncementsDto {
  @Expose()
  totalCount: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  @Type(() => AnnouncementDto)
  data: AnnouncementDto[];
}
