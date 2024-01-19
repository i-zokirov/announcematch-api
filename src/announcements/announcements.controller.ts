import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from 'src/categories/categories.service';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import Serialize from 'src/decorators/serialize.decorator';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { HttpLoggingInterceptor } from 'src/interceptors/http-logging.interceptor';
import { AnnouncementStatus, UserRoles } from 'src/types/enums';
import { User } from 'src/users/entities/user.entity';
import { FindManyOptions, In } from 'typeorm';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementDto } from './dto/announcement.dto';
import { AnnouncementsDto } from './dto/announcements.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { Announcement } from './entities/announcement.entity';

@Controller('announcements')
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@UseInterceptors(HttpLoggingInterceptor)
@ApiTags('announcements')
@ApiBearerAuth('jwt')
export class AnnouncementsController {
  constructor(
    private readonly announcementsService: AnnouncementsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Post()
  @Roles(UserRoles.Publisher)
  @Serialize(AnnouncementDto)
  @ApiOperation({
    summary: 'Create an announcement',
    description: 'Only publishers can create announcement',
  })
  @ApiBody({ type: CreateAnnouncementDto })
  async create(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @AuthUser() authUser: User,
  ) {
    const categories = await this.categoriesService.findAll({
      where: {
        id: In(createAnnouncementDto.categories),
      },
    });
    return this.announcementsService.create({
      ...createAnnouncementDto,
      categories: categories as any,
      createdBy: authUser,
    });
  }

  @Get('/published')
  @Roles(UserRoles.Admin, UserRoles.Publisher, UserRoles.Contributor)
  @Serialize(AnnouncementsDto)
  @ApiOperation({
    summary: 'Get published announcements',
    description:
      'Admins, publishers and contributors can get all announcements',
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'category_id', required: false })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category_id') categoryId?: string,
    @Query('search') search?: string,
  ) {
    try {
      const defaultPage = page ? parseInt(page) : 1;
      const defaultLimit = limit ? parseInt(limit) : 20;

      // Start building the query
      const queryBuilder =
        this.announcementsService.createQueryBuilder('announcement');

      // Join the users table
      queryBuilder.innerJoinAndSelect('announcement.createdBy', 'user');

      // Join the categories table
      queryBuilder.innerJoinAndSelect('announcement.categories', 'category');

      // Filter by status
      queryBuilder.where('announcement.status = :status', {
        status: AnnouncementStatus.Published,
      });

      // If a categoryId is provided, add a condition for that
      if (categoryId) {
        queryBuilder.andWhere('category.id = :categoryId', { categoryId });
      }

      // If a search term is provided, add a condition for that
      if (search) {
        queryBuilder.andWhere('announcement.title LIKE :search', {
          search: `%${search}%`,
        });
      }

      // Add pagination
      queryBuilder.skip((defaultPage - 1) * defaultLimit);
      queryBuilder.take(defaultLimit);

      // Get the announcements and the total count
      const [announcements, totalCount] = await queryBuilder.getManyAndCount();

      return {
        totalCount,
        page: defaultPage,
        limit: defaultLimit,
        data: announcements,
      };
    } catch (error) {
      console.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  @Get('/my')
  @Roles(UserRoles.Publisher)
  @Serialize(AnnouncementDto)
  @ApiOperation({
    summary: 'Get publisher announcements',
    description: 'Only publishers can get their own announcements',
  })
  @ApiQuery({ name: 'status', required: false })
  async getPublisherAnnouncements(
    @AuthUser() authUser: User,
    @Query('status') status?: string,
  ) {
    const findmanyOptions: FindManyOptions<Announcement> = {
      where: {
        createdBy: {
          id: authUser.id,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['categories', 'createdBy', 'acceptedProposal'],
    };

    if (status && Object.values(AnnouncementStatus).includes(status as any)) {
      findmanyOptions.where = {
        ...findmanyOptions.where,
        status: status as any,
      };
    }

    const announcements =
      await this.announcementsService.findAll(findmanyOptions);

    return announcements;
  }

  @Get(':announcement_id')
  @Roles(UserRoles.Admin, UserRoles.Publisher, UserRoles.Contributor)
  @Serialize(AnnouncementDto)
  @ApiOperation({
    summary: 'Get an announcement',
    description:
      'Admins, publishers and contributors can get an announcement by ID',
  })
  @ApiParam({ name: 'announcement_id', required: true })
  async findOne(@Param('announcement_id') id: string) {
    return this.announcementsService.findOne({
      where: {
        id,
      },
      relations: ['categories', 'createdBy'],
    });
  }

  @Patch(':announcement_id')
  @Roles(UserRoles.Publisher)
  @Serialize(AnnouncementDto)
  @ApiOperation({
    summary: 'Update an announcement',
    description: 'Only publishers can update an announcement',
  })
  @ApiParam({ name: 'announcement_id', required: true })
  async update(
    @Param('announcement_id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
    @AuthUser() authUser: User,
  ) {
    const announcement = await this.announcementsService.findOne({
      where: { id },
      relations: ['createdBy', 'categories', 'acceptedProposal'],
    });
    if (announcement.createdBy.id !== authUser.id) {
      throw new ForbiddenException(
        'You are not the owner of this announcement',
      );
    }

    const { categories: categoryIds, ...rest } = updateAnnouncementDto;

    if (categoryIds) {
      const categories = await this.categoriesService.findAll({
        where: {
          id: In(categoryIds),
        },
      });
      announcement.categories = categories;
    }

    Object.assign(announcement, rest);

    return this.announcementsService.save(announcement);
  }
}
