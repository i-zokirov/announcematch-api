import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import Serialize from 'src/decorators/serialize.decorator';
import ValidateRoutParams from 'src/decorators/validate-route-params.decorator';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { UserRoles } from 'src/types/enums';
import { FindManyOptions, Like } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersDto } from './dto/users.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@ValidateRoutParams()
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags('users')
@ApiBearerAuth('jwt')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRoles.Admin)
  @Serialize(UsersDto)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Only admins can view all users.',
  })
  async findAll(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('search') search?: string,
  ) {
    const defaultPage = page ? parseInt(page) : 1;
    const defaultLimit = limit ? parseInt(limit) : 100;
    const options: FindManyOptions<User> = {
      order: {
        createdAt: 'DESC',
      },
    };
    if (search) {
      const searchQuery = `%${search}%`;
      options.where = [
        { firstName: Like(searchQuery) },
        { lastName: Like(searchQuery) },
        { email: Like(searchQuery) },
      ];
    }
    const totalCount = await this.usersService.count(options);
    options.skip = (defaultPage - 1) * defaultLimit;
    options.take = defaultLimit;
    const foundUsers = await this.usersService.findAll(options);

    return {
      totalCount,
      page: defaultPage,
      limit: defaultLimit,
      data: foundUsers,
    };
  }

  @Get(':user_id')
  @Roles(UserRoles.Admin)
  @Serialize(UserDto)
  @ApiOperation({
    summary: 'Get user by id',
    description: 'Only admins can view a user.',
  })
  findOne(@Param('user_id') user_id: string) {
    return this.usersService.findOne({ where: { id: user_id } });
  }

  @Patch(':user_id')
  @Serialize(UserDto)
  @Roles(UserRoles.Admin, UserRoles.Publisher, UserRoles.Contributor)
  @ApiOperation({
    summary: 'Update user by id',
    description:
      'Users can update their own account. Admins can update any user and change their role.',
  })
  update(
    @Param('user_id') user_id: string,
    @Body() updateUserDto: UpdateUserDto,
    @AuthUser() authUser: User,
  ) {
    if (authUser.role !== UserRoles.Admin && authUser.id !== user_id) {
      throw new ForbiddenException('You are not allowed to update this user');
    }
    // if(updateUserDto.role && authUser.role !== UserRoles.Admin) {
    //   throw new ForbiddenException('You are not allowed to update user role');
    // }
    return this.usersService.update(user_id, updateUserDto);
  }
}
