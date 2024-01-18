import { ApiProperty } from '@nestjs/swagger';
import {
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Announcement } from 'src/announcements/entities/announcement.entity';
import { ProposalDurationType, ProposalStatus } from 'src/types/enums';
import { User } from 'src/users/entities/user.entity';

export class CreateProposalDto {
  @ApiProperty({
    type: String,
    description: 'Description of the proposal',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    type: Number,
    description: 'Price of the proposal',
    required: true,
  })
  @IsNotEmpty()
  @IsDecimal()
  price: number;

  @ApiProperty({
    type: String,
    description: 'Duration type of the proposal',
    required: true,
    enum: ProposalDurationType,
  })
  @IsNotEmpty()
  @IsEnum(ProposalDurationType)
  durationType: string;

  @ApiProperty({
    type: Number,
    description: 'Duration of the proposal',
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  duration: number;
}

export interface CreateProposalDtoWithUser extends CreateProposalDto {
  createdBy: User;
  announcement: Announcement;
  status: ProposalStatus;
}
