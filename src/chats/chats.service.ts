import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Announcement } from 'src/announcements/entities/announcement.entity';
import { ChatStatus } from 'src/types/enums';
import { User } from 'src/users/entities/user.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity';

interface CreateChatDtoWithParticipants {
  participants: User[];
  createdBy: User;
  announcement: Announcement;
  title: string;
}

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private repository: Repository<Chat>,
  ) {}

  create(createChatDto: CreateChatDtoWithParticipants) {
    const chat = this.repository.create(createChatDto);
    return this.repository.save(chat);
  }

  findAll(options?: FindManyOptions<Chat>) {
    return this.repository.find(options);
  }

  findOne(options?: FindOneOptions<Chat>) {
    return this.repository.findOne(options);
  }

  findOpenChatsWhereUserIsParticipant(user_id: string) {
    return this.repository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.participants', 'participants')
      .leftJoinAndSelect('chat.createdBy', 'createdBy')
      .leftJoinAndSelect('chat.announcement', 'announcement')
      .where('participants.id = :user_id', { user_id })
      .andWhere('chat.status = :status', { status: ChatStatus.Open })
      .getMany();
  }

  async update(id: string, user_id: string, updateChatDto: UpdateChatDto) {
    const chat = await this.repository.findOne({
      where: { id, createdBy: { id: user_id } },
    });
    if (!chat) return null;
    Object.assign(chat, updateChatDto);
    return this.repository.save(chat);
  }
}
