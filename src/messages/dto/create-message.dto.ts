import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { MessageTypes } from 'src/types/enums';
import { SanitizeHTML } from 'src/validators/sanitize-html';

export class CreateMessageDto {
  @ApiProperty({
    type: String,
    description: 'The text of the message',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @SanitizeHTML()
  text: string;

  @ApiProperty({
    type: String,
    enum: MessageTypes,
    description: 'The type of the message',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(MessageTypes)
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
