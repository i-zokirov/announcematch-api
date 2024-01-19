import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UpdateNotificationDto {
  @ApiProperty({
    description: 'The id of the notification',
    type: String,
    example: '1',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiPropertyOptional({
    description: 'The message of the notification',
    type: String,
    example: 'Hello World',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isRead: boolean;
}
