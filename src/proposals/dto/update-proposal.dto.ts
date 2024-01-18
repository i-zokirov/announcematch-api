import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDecimal,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProposalDurationType } from 'src/types/enums';

export class UpdateProposalDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Description of the proposal',
    required: true,
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Price of the proposal',
    required: true,
  })
  @IsOptional()
  @IsDecimal()
  price: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Duration type of the proposal',
    required: true,
    enum: ProposalDurationType,
  })
  @IsOptional()
  @IsEnum(ProposalDurationType)
  durationType: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Duration of the proposal',
    required: true,
  })
  @IsOptional()
  @IsInt()
  duration: number;
}
