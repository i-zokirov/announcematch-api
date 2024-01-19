import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { AnnouncementsService } from 'src/announcements/announcements.service';
import { Roles } from 'src/decorators/roles.decorator';
import { WsAuthUser } from 'src/decorators/ws-auth-user.decorator';
import { WsAuthenticationGuard } from 'src/guards/ws-authentication.guard';
import { WsAuthorizationGuard } from 'src/guards/ws-authorization.guard';
import { UserRoles } from 'src/types/enums';
import { User } from 'src/users/entities/user.entity';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@WebSocketGateway()
@UseGuards(WsAuthenticationGuard, WsAuthorizationGuard)
export class ChatsGateway {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly announcementsService: AnnouncementsService,
  ) {}

  @SubscribeMessage('createChat')
  @Roles(UserRoles.Publisher)
  async create(
    @WsAuthUser() user: User,
    @MessageBody() createChatDto: CreateChatDto,
  ) {
    const announcement = await this.announcementsService.findOne({
      where: { id: createChatDto.announcement_id, createdBy: { id: user.id } },
      relations: [
        'createdBy',
        'acceptedProposal',
        'acceptedProposal.createdBy',
      ],
    });
    if (!announcement) {
      throw new WsException('Announcement not found');
    }
    if (!announcement.acceptedProposal) {
      throw new WsException('Announcement has no accepted proposal');
    }
    return this.chatsService.create({
      participants: [user, announcement.acceptedProposal.createdBy],
      announcement,
      createdBy: user,
      title: announcement.title,
    });
  }

  @SubscribeMessage('findAllChats')
  @Roles(UserRoles.Publisher, UserRoles.Contributor)
  findAll(@WsAuthUser() user: User) {}

  @SubscribeMessage('updateChat')
  @Roles(UserRoles.Publisher)
  update(
    @WsAuthUser() user: User,
    @MessageBody() updateChatDto: UpdateChatDto,
  ) {
    return this.chatsService.update(updateChatDto.id, user.id, updateChatDto);
  }
}
