import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { Announcement } from './entities/announcement.entity';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private repository: Repository<Announcement>,
  ) {}

  create(createAnnouncementDto: CreateAnnouncementDto) {
    const announcement = this.repository.create({
      ...createAnnouncementDto,
      categories: createAnnouncementDto.categories as any,
    });
    return this.repository.save(announcement);
  }

  findAll(options?: FindManyOptions<Announcement>) {
    return this.repository.find(options);
  }
  count(options?: FindManyOptions<Announcement>) {
    return this.repository.count(options);
  }

  findOne(options?: FindOneOptions<Announcement>) {
    return this.repository.findOne(options);
  }

  async update(id: string, updateAnnouncementDto: UpdateAnnouncementDto) {
    const announcement = await this.repository.findOne({ where: { id } });
    if (!announcement)
      throw new NotFoundException(`Announcement with id ${id} not found`);
    Object.assign(announcement, updateAnnouncementDto);
    return this.repository.save(announcement);
  }

  async remove(id: string) {
    const announcement = await this.repository.findOne({ where: { id } });
    if (!announcement)
      throw new NotFoundException(`Announcement with id ${id} not found`);
    return this.repository.remove(announcement);
  }

  save(announcement: Announcement) {
    return this.repository.save(announcement);
  }

  createQueryBuilder(alias?: string, queryRunnerProvider?: any) {
    return this.repository.createQueryBuilder(alias, queryRunnerProvider);
  }
}
