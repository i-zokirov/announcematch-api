import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { MessageTypes } from 'src/types/enums';

export class CreateMessageDto {
  @ApiProperty({
    type: String,
    description: 'The text of the message',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({
    type: String,
    enum: MessageTypes,
    description: 'The type of the message',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  type: MessageTypes;

  @ApiProperty({
    type: String,
    description: 'The chat id of the message',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  chat_id: string;
}
