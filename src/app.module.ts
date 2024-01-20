import { CacheModule } from '@nestjs/cache-manager';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementsModule } from './announcements/announcements.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ChatsModule } from './chats/chats.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
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
      envFilePath: `dev.env`,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 1000,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60 * 1000,
        limit: 2000,
      },
    ]),
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
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
