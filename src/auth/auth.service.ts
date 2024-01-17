import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  generateJWT(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
    };
    return this.jwtService.sign(payload);
  }

  async authenticateUser(email: string, password: string) {
    const user = await this.usersService.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return null;
    }
    const { password: _, ...rest } = user;
    return rest;
  }
}
