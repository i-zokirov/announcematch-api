import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDecimal, IsEnum, IsInt, IsOptional } from 'class-validator';
import { ProposalDurationType } from 'src/types/enums';
import { SanitizeHTML } from 'src/validators/sanitize-html';

export class UpdateProposalDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Description of the proposal',
    required: true,
  })
  @IsOptional()
  @SanitizeHTML()
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
