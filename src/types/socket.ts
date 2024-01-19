import { Socket as SocketIoClient } from 'socket.io';
import { User } from 'src/users/entities/user.entity';

export interface Socket extends SocketIoClient {
  user?: User;
}
