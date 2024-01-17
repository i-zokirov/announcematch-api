import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  providers: [ChatsGateway, ChatsService],
})
export class ChatsModule {}
