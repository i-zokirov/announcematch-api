import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'The message of the notification',
    type: String,
    default: 'This is a notification',
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  user: User;
}
