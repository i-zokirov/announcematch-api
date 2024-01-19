import { Module } from '@nestjs/common';
import { SocketsStateService } from './sockets-state.service';

@Module({
  providers: [SocketsStateService],
  exports: [SocketsStateService],
})
export class SocketsStateModule {}
