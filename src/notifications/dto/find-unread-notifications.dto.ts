import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindUnreadNotificationsDto {
  @ApiProperty({
    description: 'The id of the user',
    type: String,
    example: '1',
  })
  @IsNotEmpty()
  @IsUUID()
  user_id: string;
}
