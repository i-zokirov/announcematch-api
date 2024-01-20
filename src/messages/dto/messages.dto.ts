import { Expose, Type } from 'class-transformer';
import { MessageDto } from './message.dto';

export class MessagesDto {
  @Expose()
  @Type(() => MessageDto)
  messages: MessageDto[];

  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;
}
