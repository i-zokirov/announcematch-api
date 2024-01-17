import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private repository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    const category = this.repository.create(createCategoryDto);
    return this.repository.save(category);
  }

  findAll(options?: FindManyOptions<Category>) {
    return this.repository.find(options);
  }

  findOne(options?: FindOneOptions<Category>) {
    return this.repository.findOne(options);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.repository.findOne({ where: { id } });
    if (!category)
      throw new NotFoundException(`Category with id ${id} not found`);
    Object.assign(category, updateCategoryDto);
    return this.repository.save(category);
  }

  async remove(id: string) {
    const category = await this.repository.findOne({ where: { id } });
    if (!category)
      throw new NotFoundException(`Category with id ${id} not found`);
    return this.repository.remove(category);
  }
}
