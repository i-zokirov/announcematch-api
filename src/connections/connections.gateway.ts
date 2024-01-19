import { UseInterceptors } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatsService } from 'src/chats/chats.service';
import { WsLoggingInterceptor } from 'src/interceptors/ws-logger.interceptor';
import { SocketsStateService } from 'src/sockets-state/sockets-state.service';
import { Socket } from 'src/types/socket';
import { UsersService } from 'src/users/users.service';
import { ConnectionsService } from './connections.service';

@WebSocketGateway({ cors: true })
@UseInterceptors(WsLoggingInterceptor)
export class ConnectionsGateway {
  constructor(
    private readonly connectionsService: ConnectionsService,
    private readonly socketStateService: SocketsStateService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly chatsService: ChatsService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.socketStateService.setServer(this.server);
  }

  async handleConnection(client: Socket) {
    const authToken = client.handshake.headers.authorization;
    if (!authToken || !authToken.startsWith('Bearer '))
      return client.disconnect();
    const token = authToken.split(' ')[1];
    if (!token) return client.disconnect();

    const { sub } = this.jwtService.verify(token);
    if (!sub) return client.disconnect();
    const user = await this.usersService.findOne({
      where: {
        id: sub,
      },
    });
    if (!user) return client.disconnect();
    console.log(`Client connected: ${client.id}`);
    const chats = await this.chatsService.findOpenChatsWhereUserIsParticipant(
      user.id,
    );

    for (const chat of chats) {
      client.join(chat.id);
      console.info(`Client ${client.id} joined chat ${chat.id}`);
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
