import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/chats/entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

interface CreateMessageDtoWithUser extends Omit<CreateMessageDto, 'chat_id'> {
  user: User;
  chat: Chat;
}

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private repository: Repository<Message>,
  ) {}

  create(createMessageDto: CreateMessageDtoWithUser) {
    const message = this.repository.create(createMessageDto);
    return this.repository.save(message);
  }

  findAll(options?: FindManyOptions<Message>) {
    return this.repository.find(options);
  }
  count(options?: FindManyOptions<Message>) {
    return this.repository.count(options);
  }

  findOne(options?: FindOneOptions<Message>) {
    return this.repository.findOne(options);
  }
}
