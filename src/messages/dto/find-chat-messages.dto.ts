import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class FindChatMessagesDto {
  @ApiProperty({
    type: String,
    description: 'The chat id of the message',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  chat_id: string;

  @ApiProperty({
    type: Number,
    description: 'The page number of the message',
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  page: number;

  @ApiProperty({
    type: Number,
    description: 'The page size of the message',
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  limit: number;
}
