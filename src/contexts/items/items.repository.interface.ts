import { ItemEntity } from './entities/item.entity';

export const ITEMS_REPOSITORY = Symbol('ITEMS_REPOSITORY');

export interface ItemsRepositoryInterface {
  createAndSave(data: Partial<ItemEntity>): Promise<ItemEntity>;
  findAll(): Promise<ItemEntity[]>;
  findByCategoryId(categoryId: string): Promise<ItemEntity[]>;
}
