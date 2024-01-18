import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementsModule } from 'src/announcements/announcements.module';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { UsersModule } from 'src/users/users.module';
import { Proposal } from './entities/proposal.entity';
import { ProposalsController } from './proposals.controller';
import { ProposalsService } from './proposals.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Proposal]),
    AuthModule,
    UsersModule,
    AnnouncementsModule,
    NotificationsModule,
  ],
  controllers: [ProposalsController],
  providers: [ProposalsService],
})
export class ProposalsModule {}
