import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/auth-user';
import Serialize from 'src/decorators/serialize.decorator';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { UserRoles } from 'src/types/enums';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { AuthSuccessDto } from './dto/auth-success.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('auth')
@Serialize(AuthSuccessDto)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginUserDto: LoginDto) {
    try {
      const authenticatedUser = await this.authService.authenticateUser(
        loginUserDto.email,
        loginUserDto.password,
      );
      if (!authenticatedUser) {
        throw new BadRequestException('Invalid credentials');
      }
      return {
        ...authenticatedUser,
        access_token: this.authService.generateJWT(authenticatedUser as User),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('signup/contributor')
  @ApiOperation({ summary: 'Signup as contributor' })
  @ApiBody({ type: CreateUserDto })
  async signUpContributor(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create({
      ...createUserDto,
      role: UserRoles.Contributor,
    });
    const { password: _, ...rest } = user;
    return {
      ...rest,
      access_token: this.authService.generateJWT(user),
    };
  }

  @Post('signup/publisher')
  @ApiOperation({ summary: 'Signup as publisher' })
  @ApiBody({ type: CreateUserDto })
  async signupPublisher(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create({
      ...createUserDto,
      role: UserRoles.Publisher,
    });
    const { password: _, ...rest } = user;
    return {
      ...rest,
      access_token: this.authService.generateJWT(user),
    };
  }

  @Get('me')
  @UseGuards(AuthenticationGuard)
  @ApiOperation({ summary: 'Get current user' })
  @ApiBearerAuth('jwt')
  async me(@AuthUser() user: User) {
    return user;
  }
}
