import { Module } from '@nestjs/common';
import { ChatsModule } from 'src/chats/chats.module';
import { SocketsStateModule } from 'src/sockets-state/sockets-state.module';
import { UsersModule } from 'src/users/users.module';
import { ConnectionsGateway } from './connections.gateway';
import { ConnectionsService } from './connections.service';

@Module({
  imports: [UsersModule, SocketsStateModule, ChatsModule],
  providers: [ConnectionsGateway, ConnectionsService],
  exports: [ConnectionsService],
})
export class ConnectionsModule {}
