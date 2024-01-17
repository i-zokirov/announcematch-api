import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const client = context.switchToWs().getClient();
    const authToken = client.handshake.headers.authorization;

    if (!authToken || !authToken.startsWith('Bearer ')) {
      return false;
    }

    const token = authToken.split(' ')[1];

    if (!token) return false;

    try {
      const { sub } = this.jwtService.verify(token);
      if (!sub) throw new WsException('Invalid token');
      const user = await this.usersService.findOne({
        where: {
          id: sub,
        },
      });
      if (!user) throw new WsException('Invalid token');
      client.user = user;

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
