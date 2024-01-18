import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ProposalsService } from 'src/proposals/proposals.service';

@Injectable()
export class OneProposalPerAnnouncement implements CanActivate {
  constructor(private readonly proposalsService: ProposalsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    const announcement = request.announcement;

    if (request.method === 'POST') {
      const proposals = await this.proposalsService.find({
        where: {
          announcement: {
            id: announcement.id,
          },
          createdBy: {
            id: user.id,
          },
        },
        relations: ['createdBy', 'announcement'],
      });

      if (proposals.length) {
        throw new ForbiddenException(
          `You already have a proposal for this announcement`,
        );
      }
    }

    return true;
  }
}
