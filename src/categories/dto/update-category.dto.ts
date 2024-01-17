import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Name of the category',
    required: true,
  })
  @IsOptional()
  @IsString()
  @Length(3, 255)
  name: string;
}
