import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Chat } from 'src/chats/entities/chat.entity';
import { WsAuthUser } from 'src/decorators/ws-auth-user.decorator';
import { WsCurrentChat } from 'src/decorators/ws-current-chat.decorator';
import { WsChatAuthorizationGuard } from 'src/guards/chat-authorization.guard';
import { WsAuthenticationGuard } from 'src/guards/ws-authentication.guard';
import { WsAuthorizationGuard } from 'src/guards/ws-authorization.guard';
import { User } from 'src/users/entities/user.entity';
import { FindManyOptions } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { FindChatMessagesDto } from './dto/find-chat-messages.dto';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';

@WebSocketGateway()
@UseGuards(
  WsAuthenticationGuard,
  WsAuthorizationGuard,
  WsChatAuthorizationGuard,
)
export class MessagesGateway {
  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('createMessage')
  createMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @WsAuthUser() user: User,
    @WsCurrentChat() chat: Chat,
  ) {
    const { chat_id, ...rest } = createMessageDto;
    return this.messagesService.create({ ...rest, user, chat });
  }

  @SubscribeMessage('findChatMessages')
  async findChatMessages(
    @MessageBody() findChatMessagesDto: FindChatMessagesDto,
  ) {
    const { chat_id, page, limit } = findChatMessagesDto;
    const options: FindManyOptions<Message> = {
      where: {
        chat: {
          id: chat_id,
        },
      },
    };
    const total = await this.messagesService.count(options);
    const messages = await this.messagesService.findAll({
      ...options,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      messages,
      total,
      page,
      limit,
    };
  }
}
