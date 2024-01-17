import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoles } from 'src/types/enums';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

interface CreateUserDtoWithRole extends CreateUserDto {
  role: UserRoles;
}

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  create(createUserDto: CreateUserDtoWithRole) {
    const user = this.repository.create(createUserDto);
    return this.repository.save(user);
  }

  findAll(query?: FindManyOptions<User>) {
    return this.repository.find(query);
  }
  count(query?: FindManyOptions<User>) {
    return this.repository.count(query);
  }

  findOne(query?: FindOneOptions<User>) {
    return this.repository.findOne(query);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    Object.assign(user, updateUserDto);
    return this.repository.save(user);
  }

  async remove(id: string) {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return this.repository.remove(user);
  }
}
