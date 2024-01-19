import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ChatsService } from 'src/chats/chats.service';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { ChatStatus } from 'src/types/enums';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WsChatAuthorizationGuard implements CanActivate {
  constructor(private chatService: ChatsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const wsContext = context.switchToWs();
    const client = wsContext.getClient<any>();
    const data = wsContext.getData() as CreateMessageDto;
    const user = client.user as User;

    const chat = await this.chatService.findOne({
      where: { id: data.chat_id },
      relations: ['participants'],
    });
    if (!chat) throw new WsException('Chat not found');

    const isParticipant = chat.participants.some(
      (participant) => participant.id === user.id,
    );

    const isOpen = chat.status === ChatStatus.Open;

    client.chat = chat;

    return isParticipant && isOpen;
  }
}
