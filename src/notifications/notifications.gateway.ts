import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsService } from './notifications.service';

@WebSocketGateway()
export class NotificationsGateway {
  constructor(private readonly notificationsService: NotificationsService) {}

  @SubscribeMessage('findAllNotifications')
  findAll() {
    return this.notificationsService.findAll();
  }

  @SubscribeMessage('updateNotification')
  update(@MessageBody() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(updateNotificationDto);
  }
}
