import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemEntity } from './entities/item.entity';
import { ItemsRepositoryInterface } from './items.repository.interface';

@Injectable()
export class ItemsRepository implements ItemsRepositoryInterface {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly repo: Repository<ItemEntity>,
  ) {}

  async createAndSave(data: Partial<ItemEntity>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({
      relations: { category: true, ownerProfile: true },
      order: { createdAt: 'DESC' },
    });
  }

  findByCategoryId(categoryId: string) {
    return this.repo.find({
      where: { categoryId },
      relations: { category: true, ownerProfile: true },
      order: { createdAt: 'DESC' },
    });
  }
}
