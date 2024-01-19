import { CacheModule } from '@nestjs/cache-manager';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementsModule } from './announcements/announcements.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ChatsModule } from './chats/chats.module';
import { TypeOrmConfigService } from './config/typeorm.config';
import { ConnectionsModule } from './connections/connections.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProposalsModule } from './proposals/proposals.module';
import { SocketsStateModule } from './sockets-state/sockets-state.module';
import { UsersModule } from './users/users.module';
import { WinstonLoggerModule } from './winston-logger/winston-logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    CacheModule.register({
      isGlobal: true,
      // 1 minute in milliseconds
      ttl: 60 * 1000,
    }),
    UsersModule,
    AuthModule,
    AnnouncementsModule,
    ProposalsModule,
    NotificationsModule,
    MessagesModule,
    CategoriesModule,
    ChatsModule,
    ConnectionsModule,
    SocketsStateModule,
    WinstonLoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {}
