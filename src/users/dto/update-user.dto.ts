import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRoles } from 'src/types/enums';

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

  @ApiPropertyOptional({
    type: String,
    enum: UserRoles,
    description: 'Role of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(UserRoles)
  role: UserRoles;
}
