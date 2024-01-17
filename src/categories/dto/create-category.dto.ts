import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    type: String,
    description: 'Name of the category',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  name: string;
}
