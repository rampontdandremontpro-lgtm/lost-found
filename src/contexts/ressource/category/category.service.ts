import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

import { CategoryAlreadyExistsError, CategoryNotFoundError } from './errors/category.errors';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const name = dto.name.trim();

    const existing = await this.categoryRepo
      .createQueryBuilder('c')
      .where('LOWER(c.name) = LOWER(:name)', { name })
      .getOne();

    if (existing) throw new CategoryAlreadyExistsError(name);

    const category = this.categoryRepo.create({ name });
    return this.categoryRepo.save(category);
  }

  findAll() {
    return this.categoryRepo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new CategoryNotFoundError(id);
    return category;
  }

  async remove(id: string) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new CategoryNotFoundError(id);

    await this.categoryRepo.delete(id);
    return { deleted: true };
  }
}
