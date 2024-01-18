import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { AnnouncementsService } from 'src/announcements/announcements.service';
import { AnnouncementStatus } from 'src/types/enums';

@Injectable()
export class AnnouncementGuard implements CanActivate {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const announcement_id = request.params.announcement_id;

    if (!announcement_id || !isUUID(announcement_id)) {
      throw new BadRequestException('Invalid announcement id');
    }

    const announcement = await this.announcementsService.findOne({
      where: { id: announcement_id },
      relations: ['createdBy', 'acceptedProposal'],
    });

    if (!announcement) {
      throw new NotFoundException(
        `Announcement with id ${announcement_id} not found`,
      );
    }

    // Check if request is post/patch and announcement is not published or expired

    if (
      (request.method === 'POST' || request.method === 'PATCH') &&
      (announcement.status !== AnnouncementStatus.Published ||
        (announcement.expiresAt &&
          new Date(announcement.expiresAt) < new Date()))
    ) {
      throw new BadRequestException('Announcement is not published or expired');
    }

    request.announcement = announcement;

    return true;
  }
}
