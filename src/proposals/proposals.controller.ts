import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AnnouncementsService } from 'src/announcements/announcements.service';
import { Announcement } from 'src/announcements/entities/announcement.entity';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { CurrentAnnouncement } from 'src/decorators/current-announcement';
import { Roles } from 'src/decorators/roles.decorator';
import Serialize from 'src/decorators/serialize.decorator';
import ValidateRoutParams from 'src/decorators/validate-route-params.decorator';
import { AnnouncementGuard } from 'src/guards/announcement.guard';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { OneProposalPerAnnouncement } from 'src/guards/oneproposalperannouncement.guard';
import { HttpLoggingInterceptor } from 'src/interceptors/http-logging.interceptor';
import { NotificationsService } from 'src/notifications/notifications.service';
import { AnnouncementStatus, ProposalStatus, UserRoles } from 'src/types/enums';
import { User } from 'src/users/entities/user.entity';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { PorposalDto } from './dto/proposal.dto';
import { RejectProposalDto } from './dto/reject-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { ProposalsService } from './proposals.service';

@Controller('announcements/:announcement_id/proposals')
@UseGuards(
  AuthenticationGuard,
  AuthorizationGuard,
  AnnouncementGuard,
  OneProposalPerAnnouncement,
)
@ValidateRoutParams()
@Serialize(PorposalDto)
@UseInterceptors(HttpLoggingInterceptor)
@ApiTags('proposals')
@ApiBearerAuth('jwt')
@ApiParam({ name: 'announcement_id', type: String, required: true })
export class ProposalsController {
  constructor(
    private readonly proposalsService: ProposalsService,
    private readonly announcementsService: AnnouncementsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post()
  @Roles(UserRoles.Contributor)
  @ApiOperation({
    summary: 'Create a proposal',
    description: 'Only contributors can create proposal',
  })
  @ApiBody({ type: CreateProposalDto })
  async create(
    @AuthUser() authUser: User,
    @CurrentAnnouncement() announcement: Announcement,
    @Body() createProposalDto: CreateProposalDto,
  ) {
    return this.proposalsService.create({
      ...createProposalDto,
      createdBy: authUser,
      status: ProposalStatus.Pending,
      announcement,
      price: parseFloat(createProposalDto.price.toString()),
    });
  }

  @Get()
  @Roles(UserRoles.Admin, UserRoles.Publisher)
  @ApiOperation({
    summary: 'Get all proposals',
    description: 'Only admins and publishers can get all proposals',
  })
  findAll(@CurrentAnnouncement() announcement: Announcement) {
    return this.proposalsService.find({
      where: {
        announcement: {
          id: announcement.id,
        },
      },
      relations: ['createdBy'],
    });
  }

  @Get('my')
  @Roles(UserRoles.Contributor)
  @ApiOperation({
    summary: 'Get all proposals of the current user',
    description: 'Only contributors can get their own proposals',
  })
  async findContributorsProposal(
    @AuthUser() authUser: User,
    @CurrentAnnouncement() announcement: Announcement,
  ) {
    const porposals = await this.proposalsService.find({
      where: {
        createdBy: {
          id: authUser.id,
        },
        announcement: {
          id: announcement.id,
        },
      },
      relations: ['createdBy', 'announcement'],
    });

    return porposals;
  }

  @Get(':proposal_id')
  @Roles(UserRoles.Admin, UserRoles.Publisher, UserRoles.Contributor)
  @ApiOperation({
    summary: 'Get a proposal by id',
    description:
      'Only admins, publishers and contributors can get a proposal by id. Contributors can only get their own proposals',
  })
  @ApiParam({ name: 'proposal_id', type: String, required: true })
  async findOne(
    @Param('proposal_id') id: string,
    @AuthUser() authUser: User,
    @CurrentAnnouncement() announcement: Announcement,
  ) {
    const porposal = await this.proposalsService.findOne({
      where: {
        id,
        announcement: {
          id: announcement.id,
        },
      },
      relations: ['createdBy', 'announcement'],
    });

    if (!porposal) {
      throw new NotFoundException(`Proposal with id ${id} not found`);
    }

    if (
      authUser.role === UserRoles.Contributor &&
      porposal.createdBy.id !== authUser.id
    ) {
      throw new ForbiddenException(
        `You cannot get a proposal that you did not create`,
      );
    }

    return porposal;
  }

  @Patch(':proposal_id')
  @Roles(UserRoles.Contributor)
  @ApiOperation({
    summary: 'Update a proposal',
    description: 'Only contributors can update their own proposals',
  })
  @ApiBody({ type: UpdateProposalDto })
  @ApiParam({ name: 'proposal_id', type: String, required: true })
  async update(
    @Param('proposal_id') id: string,
    @Body() updateProposalDto: UpdateProposalDto,
    @AuthUser() authUser: User,
    @CurrentAnnouncement() announcement: Announcement,
  ) {
    const proposal = await this.proposalsService.findOne({
      where: {
        id,
        announcement: {
          id: announcement.id,
        },
      },
      relations: ['createdBy', 'announcement'],
    });

    if (!proposal) {
      throw new NotFoundException(`Proposal with id ${id} not found`);
    }

    if (authUser.id !== proposal.createdBy.id) {
      throw new ForbiddenException(
        `You cannot update a proposal that you did not create`,
      );
    }

    Object.assign(proposal, updateProposalDto);

    return this.proposalsService.save(proposal);
  }

  @Patch(':proposal_id/accept')
  @Roles(UserRoles.Publisher)
  @ApiOperation({
    summary: 'Accept a proposal',
    description: 'Only publishers can accept proposals',
  })
  @ApiParam({ name: 'proposal_id', type: String, required: true })
  async accept(
    @Param('proposal_id') id: string,
    @AuthUser() authUser: User,
    @CurrentAnnouncement() announcement: Announcement,
  ) {
    if (authUser.id !== announcement.createdBy.id) {
      throw new ForbiddenException(
        `You cannot accept a proposal to an announcement that you did not create`,
      );
    }

    if (
      announcement.acceptedProposal ||
      announcement.status === AnnouncementStatus.AcceptedProposal
    ) {
      throw new ForbiddenException(
        `You cannot accept a proposal to an announcement that already has an accepted proposal`,
      );
    }

    const proposal = await this.proposalsService.findOne({
      where: {
        id,
        announcement: {
          id: announcement.id,
        },
      },
      relations: ['createdBy', 'announcement'],
    });

    if (!proposal) {
      throw new NotFoundException(`Proposal with id ${id} not found`);
    }

    if (proposal.status === ProposalStatus.Accepted) {
      throw new ForbiddenException(
        `You cannot accept a proposal that was already accepted`,
      );
    }

    announcement.acceptedProposal = proposal;
    announcement.status = AnnouncementStatus.AcceptedProposal;
    await this.announcementsService.save(announcement);

    proposal.status = ProposalStatus.Accepted;
    const saved = await this.proposalsService.save(proposal);

    const notification = {
      message: `Your proposal to the announcement "${announcement.title}" was accepted!`,
      user: proposal.createdBy,
    };

    // TODO: NOTIFY CONTRIBUTORS THAT THEIR PROPOSAL WAS  ACCEPTED
    await this.notificationsService.create(notification);

    return saved;
  }

  @Patch(':proposal_id/reject')
  @Roles(UserRoles.Publisher)
  @ApiOperation({
    summary: 'Reject a proposal',
    description: 'Only publishers can reject proposals',
  })
  @ApiParam({ name: 'proposal_id', type: String, required: true })
  @ApiBody({ type: RejectProposalDto })
  async reject(
    @Param('proposal_id') id: string,
    @AuthUser() authUser: User,
    @CurrentAnnouncement() announcement: Announcement,
    @Body() rejectProposalDto: RejectProposalDto,
  ) {
    if (authUser.id !== announcement.createdBy.id) {
      throw new ForbiddenException(
        `You cannot reject a proposal to an announcement that you did not create`,
      );
    }

    const proposal = await this.proposalsService.findOne({
      where: {
        id,
        announcement: {
          id: announcement.id,
        },
      },
      relations: ['createdBy', 'announcement'],
    });

    if (!proposal) {
      throw new NotFoundException(`Proposal with id ${id} not found`);
    }

    proposal.status = ProposalStatus.Rejected;
    const saved = await this.proposalsService.save(proposal);
    // TODO: NOTIFY CONTRIBUTOR THAT THEIR PROPOSAL WAS  REJECTED

    const notification = {
      message: `Your proposal to the announcement "${announcement.title}" was rejected!`,
      user: proposal.createdBy,
    };

    await this.notificationsService.create(notification);

    return saved;
  }

  @Patch(':proposal_id/withdraw')
  @Roles(UserRoles.Contributor)
  @ApiOperation({
    summary: 'Withdraw a proposal',
    description: 'Only contributors can withdraw their own proposals',
  })
  @ApiParam({ name: 'proposal_id', type: String, required: true })
  async withdraw(
    @Param('proposal_id') id: string,
    @AuthUser() authUser: User,
    @CurrentAnnouncement() announcement: Announcement,
  ) {
    const proposal = await this.proposalsService.findOne({
      where: {
        id,
        announcement: {
          id: announcement.id,
        },
      },
      relations: ['createdBy', 'announcement'],
    });

    if (!proposal) {
      throw new NotFoundException(`Proposal with id ${id} not found`);
    }

    if (authUser.id !== proposal.createdBy.id) {
      throw new ForbiddenException(
        `You cannot withdraw a proposal that you did not create`,
      );
    }

    if (proposal.status === ProposalStatus.Withdrawn) {
      throw new ForbiddenException(
        `You cannot withdraw a proposal that was already withdrawn`,
      );
    }

    if (
      announcement.acceptedProposal &&
      announcement.acceptedProposal.id === proposal.id
    ) {
      throw new ForbiddenException(
        `You cannot withdraw a proposal that was already accepted by the publisher`,
      );
    }

    proposal.status = ProposalStatus.Withdrawn;
    const saved = await this.proposalsService.save(proposal);

    return saved;
  }
}
