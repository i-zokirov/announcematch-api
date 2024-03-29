import { UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Chat } from 'src/chats/entities/chat.entity';
import Serialize from 'src/decorators/serialize.decorator';
import { WsAuthUser } from 'src/decorators/ws-auth-user.decorator';
import { WsCurrentChat } from 'src/decorators/ws-current-chat.decorator';
import { WsChatAuthorizationGuard } from 'src/guards/chat-authorization.guard';
import { WsAuthenticationGuard } from 'src/guards/ws-authentication.guard';
import { WsAuthorizationGuard } from 'src/guards/ws-authorization.guard';
import { WsLoggingInterceptor } from 'src/interceptors/ws-logger.interceptor';
import { Socket } from 'src/types/socket';
import { User } from 'src/users/entities/user.entity';
import { FindManyOptions } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { FindChatMessagesDto } from './dto/find-chat-messages.dto';
import { MessageDto } from './dto/message.dto';
import { MessagesDto } from './dto/messages.dto';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';

@WebSocketGateway()
@UseGuards(
  WsAuthenticationGuard,
  WsAuthorizationGuard,
  WsChatAuthorizationGuard,
)
@UseInterceptors(WsLoggingInterceptor)
export class MessagesGateway {
  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('createMessage')
  @Serialize(MessageDto)
  async createMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @WsAuthUser() user: User,
    @WsCurrentChat() chat: Chat,
    @ConnectedSocket() client: Socket,
  ) {
    const { chat_id, ...rest } = createMessageDto;
    const message = await this.messagesService.create({ ...rest, user, chat });
    client.to(chat_id).emit('newMessage', message);
    return message;
  }

  @SubscribeMessage('findChatMessages')
  @Serialize(MessagesDto)
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
      relations: ['user', 'chat'],
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
