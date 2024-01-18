import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [NotificationsGateway, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
