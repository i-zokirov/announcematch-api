import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { AnnouncementStatus } from 'src/types/enums';
import { User } from 'src/users/entities/user.entity';

export class CreateAnnouncementDto {
  @ApiProperty({
    type: String,
    description: 'Title of the announcement',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    description: 'Description of the announcement',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
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
  @IsString()
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

  @ApiProperty({
    type: [String],
    description: 'Category IDs of the announcement',
    required: true,
  })
  @IsNotEmpty()
  @IsString({ each: true })
  categories: string[];

  createdBy: User;
}
