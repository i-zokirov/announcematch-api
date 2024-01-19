import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AnnouncementsService } from 'src/announcements/announcements.service';
import { CreateChatDto } from 'src/chats/dto/create-chat.dto';

@Injectable()
export class WsAnnouncementInterceptor implements NestInterceptor {
  constructor(private announcementsService: AnnouncementsService) {} // Inject the service

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const wsContext = context.switchToWs();
    const client = wsContext.getClient<any>();
    const data = wsContext.getData() as CreateChatDto;

    const user = client.user; // Get the user from the client

    if (!user) {
      throw new WsException('Unauthorized access');
    }

    // You can now access the MessageBody and other details
    console.log('Incoming message data:', data);

    const announcement = await this.announcementsService.findOne({
      where: { id: data.announcement_id, createdBy: { id: user.id } },
    });

    if (!announcement) {
      throw new WsException('Announcement not found');
    }

    client.announcement = announcement; // Attach the announcement to the client
    return next.handle().pipe(
      tap(() => {
        console.log(`After processing message from client ${client.id}`);
      }),
    );
  }
}
