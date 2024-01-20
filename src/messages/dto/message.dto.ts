import { Expose, Type } from 'class-transformer';
import { ChatDto } from 'src/chats/dto/chat.dto';
import { UserDto } from 'src/users/dto/user.dto';

export class MessageDto {
  @Expose()
  id: string;

  @Expose()
  text: string | null;

  @Expose()
  type: string;

  @Expose()
  file: string | null;

  @Expose()
  image: string | null;

  @Expose()
  video: string | null;

  @Expose()
  audio: string | null;

  @Expose()
  isRead: boolean;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @Type(() => ChatDto)
  chat: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
