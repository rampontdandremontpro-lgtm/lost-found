import {Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { ItemEntity } from '../../../items/entities/item.entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 60 })
  name: string; 

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ItemEntity, (item) => item.category)
  items: ItemEntity[];
}
