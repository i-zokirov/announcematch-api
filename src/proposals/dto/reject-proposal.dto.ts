import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RejectProposalDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Custom message',
    required: false,
  })
  @IsOptional()
  @IsString()
  customMessage: string;
}
