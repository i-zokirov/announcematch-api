import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { UserRoles } from 'src/types/enums';
import { SanitizeHTML } from 'src/validators/sanitize-html';

export class UpdateUserDto {
  @ApiPropertyOptional({
    type: String,
    description: 'First name of the user',
    required: true,
  })
  @IsOptional()
  @SanitizeHTML()
  firstName: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Last name of the user',
    required: true,
  })
  @IsOptional()
  @SanitizeHTML()
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
  @IsEnum(UserRoles)
  role: UserRoles;
}
