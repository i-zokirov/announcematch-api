import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ChatStatus } from 'src/types/enums';
import { SanitizeHTML } from 'src/validators/sanitize-html';

export class UpdateChatDto {
  @ApiProperty({
    description: 'The id of the chat',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiPropertyOptional({
    description: 'The status of the chat',
    type: String,
    example: ChatStatus.Open,
    required: false,
    enum: ChatStatus,
  })
  @IsOptional()
  @IsEnum(ChatStatus)
  status: ChatStatus;

  @ApiPropertyOptional({
    description: 'The title of the chat',
    type: String,
    example: 'Chat title',
    required: false,
  })
  @IsOptional()
  @IsString()
  @SanitizeHTML()
  title: string;
}
