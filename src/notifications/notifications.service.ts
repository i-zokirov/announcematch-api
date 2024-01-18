import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private repository: Repository<Notification>,
  ) {}

  create(createNotificationDto: CreateNotificationDto) {
    const notification = this.repository.create(createNotificationDto);
    return this.repository.save(notification);
  }

  findAll(options?: FindManyOptions<Notification>) {
    return this.repository.find(options);
  }

  findOne(options: FindOneOptions<Notification>) {
    return this.repository.findOne(options);
  }

  async update(updateNotificationDto: UpdateNotificationDto) {
    const { id, user, ...rest } = updateNotificationDto;
    const notification = await this.repository.findOne({
      where: { id },
    });

    if (!notification) {
      return null;
    }

    Object.assign(notification, rest);
    return this.repository.save(notification);
  }
}
