import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import ValidateRoutParams from 'src/decorators/validate-route-params.decorator';
import { UserRoles } from 'src/types/enums';
import { FindManyOptions } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('jwt')
@ValidateRoutParams()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Only admins can view all users.',
  })
  @Roles(UserRoles.Admin)
  findAll(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('search') search?: string,
  ) {
    const defaultPage = page ? parseInt(page) : 1;
    const defaultLimit = limit ? parseInt(limit) : 100;
    const options: FindManyOptions = {};
    if (search) {
      const searchQuery = `%${search}%`;
      options.where = [
        { firstname: { $like: searchQuery } },
        { lastname: { $like: searchQuery } },
        { email: { $like: searchQuery } },
      ];
    }
    const totalCount = this.usersService.count(options);
    options.skip = (defaultPage - 1) * defaultLimit;
    options.take = defaultLimit;
    const foundUsers = this.usersService.findAll(options);

    return {
      totalCount,
      page: defaultPage,
      limit: defaultLimit,
      data: foundUsers,
    };
  }

  @Get(':user_id')
  @Roles(UserRoles.Admin)
  @ApiOperation({
    summary: 'Get user by id',
    description: 'Only admins can view a user.',
  })
  findOne(@Param('user_id') user_id: string) {
    return this.usersService.findOne({ where: { id: user_id } });
  }

  @Patch(':user_id')
  @Roles(UserRoles.Admin, UserRoles.Publisher, UserRoles.Contributor)
  update(
    @Param('user_id') user_id: string,
    @Body() updateUserDto: UpdateUserDto,
    @AuthUser() authUser: User,
  ) {
    if (authUser.role !== UserRoles.Admin && authUser.id !== user_id) {
      throw new ForbiddenException('You are not allowed to update this user');
    }
    return this.usersService.update(user_id, updateUserDto);
  }
}
