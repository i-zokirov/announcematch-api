import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { SanitizeHTML } from 'src/validators/sanitize-html';

export class UpdateMessageDto {
  @ApiProperty({
    type: String,
    description: 'The id of the message',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  message_id: string;

  @ApiPropertyOptional({
    type: String,
    description: 'The text of the message',
    required: false,
  })
  @IsNotEmpty()
  @SanitizeHTML()
  text: string;

  @ApiProperty({
    type: String,
    description: 'The chat id of the message',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  chat_id: string;
}
