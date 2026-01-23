import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { ItemEntity } from './entities/item.entity';
import { ITEMS_REPOSITORY } from './items.repository.interface';
import { ItemsRepository } from './items.repository';
import { CategoryModule } from '../ressource/category/category.module';
import { CategoryEntity } from '../ressource/category/entities/category.entity';
import { UserProfileEntity } from '../profile/entities/user_profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemEntity, CategoryEntity, UserProfileEntity]),
    CategoryModule, 
  ],
  controllers: [ItemsController],
  providers: [
    ItemsService,
    { provide: ITEMS_REPOSITORY, useClass: ItemsRepository },
  ],
})
export class ItemsModule {}
