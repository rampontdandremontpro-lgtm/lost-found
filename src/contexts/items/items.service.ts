import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemsQueryDto } from './dto/items-query.dto';

import { ItemEntity } from './entities/item.entity';
import { CategoryEntity } from '../ressource/category/entities/category.entity';
import { UserProfileEntity } from '../profile/entities/user_profile.entity';

import { OwnerProfileNotFoundError, ItemNotFoundError } from './errors/items.errors';
import { CategoryNotFoundError } from '../ressource/category/errors/category.errors';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemRepo: Repository<ItemEntity>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,

    @InjectRepository(UserProfileEntity)
    private readonly profileRepo: Repository<UserProfileEntity>,
  ) {}

  async create(ownerProfileId: string, dto: CreateItemDto) {
    const ownerProfile = await this.profileRepo.findOne({ where: { id: ownerProfileId } });
    if (!ownerProfile) throw new OwnerProfileNotFoundError(ownerProfileId);

    const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
    if (!category) throw new CategoryNotFoundError(dto.categoryId);

    const item = this.itemRepo.create({
      title: dto.title,
      description: dto.description,
      status: dto.status,
      categoryId: dto.categoryId,
      ownerProfileId,
    });

    return this.itemRepo.save(item);
  }

  async findAll(query: ItemsQueryDto) {
    const qb = this.itemRepo
      .createQueryBuilder('i')
      .leftJoinAndSelect('i.category', 'c')
      .leftJoinAndSelect('i.ownerProfile', 'p')
      .orderBy('i.createdAt', 'DESC');

    if (query.status) qb.andWhere('i.status = :status', { status: query.status });
    if (query.ownerProfileId) qb.andWhere('i.ownerProfileId = :ownerProfileId', { ownerProfileId: query.ownerProfileId });
    if (query.category) qb.andWhere('LOWER(c.name) = LOWER(:name)', { name: query.category.trim() });

    return qb.getMany();
  }

  async findOne(id: string) {
    const item = await this.itemRepo.findOne({
      where: { id },
      relations: { category: true, ownerProfile: true },
    });
    if (!item) throw new ItemNotFoundError(id);
    return item;
  }

  async update(id: string, dto: UpdateItemDto) {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) throw new ItemNotFoundError(id);

    Object.assign(item, dto);
    return this.itemRepo.save(item);
  }

  async remove(id: string) {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) throw new ItemNotFoundError(id);

    await this.itemRepo.delete(id);
    return { deleted: true };
  }
}