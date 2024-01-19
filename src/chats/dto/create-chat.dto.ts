import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    description: 'The id of the announcement to create the chat for',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  announcement_id: string;
}
