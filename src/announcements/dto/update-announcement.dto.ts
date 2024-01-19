import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { AnnouncementStatus } from 'src/types/enums';
import { SanitizeHTML } from 'src/validators/sanitize-html';

export class UpdateAnnouncementDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Title of the announcement',
    required: false,
  })
  @IsOptional()
  @IsString()
  @SanitizeHTML()
  title: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Description of the announcement',
    required: false,
  })
  @IsOptional()
  @IsString()
  @SanitizeHTML()
  description: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Image of the announcement',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  image: string;

  @ApiPropertyOptional({
    type: String,
    enum: AnnouncementStatus,
    description: 'Status of the announcement. Default is Draft',
    required: false,
  })
  @IsOptional()
  @IsEnum(AnnouncementStatus)
  status: AnnouncementStatus;

  @ApiPropertyOptional({
    type: String,
    description: 'Expiration date of the announcement',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expiresAt: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Category IDs of the announcement',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  categories: string[];
}
