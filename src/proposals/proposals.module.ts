import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposal } from './entities/proposal.entity';
import { ProposalsController } from './proposals.controller';
import { ProposalsService } from './proposals.service';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal])],
  controllers: [ProposalsController],
  providers: [ProposalsService],
})
export class ProposalsModule {}
