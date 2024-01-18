import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Announcement } from 'src/announcements/entities/announcement.entity';

export const CurrentAnnouncement = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.announcement as Announcement;
  },
);
