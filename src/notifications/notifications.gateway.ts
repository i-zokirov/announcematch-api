import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WsAuthUser } from 'src/decorators/ws-auth-user.decorator';
import { WsAuthenticationGuard } from 'src/guards/ws-authentication.guard';
import { User } from 'src/users/entities/user.entity';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsService } from './notifications.service';

@WebSocketGateway()
@UseGuards(WsAuthenticationGuard)
export class NotificationsGateway {
  constructor(private readonly notificationsService: NotificationsService) {}

  @SubscribeMessage('findUnreadNotifications')
  findUnread(@WsAuthUser() user: User) {
    return this.notificationsService.findAll({
      where: {
        user: {
          id: user.id,
        },
        isRead: false,
      },
    });
  }

  @SubscribeMessage('updateNotification')
  update(
    @WsAuthUser() user: User,
    @MessageBody() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(user.id, updateNotificationDto);
  }
}
