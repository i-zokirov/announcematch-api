import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Chat } from 'src/chats/entities/chat.entity';

export const WsCurrentChat = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient<any>();
    return client.chat as Chat;
  },
);
