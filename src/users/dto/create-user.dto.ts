import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { SanitizeHTML } from 'src/validators/sanitize-html';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'First name of the user',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @SanitizeHTML()
  firstName: string;

  @ApiProperty({
    type: String,
    description: 'Last name of the user',
    required: true,
  })
  @IsNotEmpty()
  @SanitizeHTML()
  lastName: string;

  @ApiProperty({
    type: String,
    description: 'Email of the user',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Password of the user',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;
}
