import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    type: String,
    description: 'First name of the user',
    required: true,
  })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Last name of the user',
    required: true,
  })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Email of the user',
    required: true,
  })
  @IsOptional()
  @IsEmail()
  email: string;
}
