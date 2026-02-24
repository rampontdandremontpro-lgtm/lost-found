import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { UserCredentialsEntity } from '../../auth/entities/user_credentials.entity';
import { UserProfileEntity } from 'src/contexts/profile/entities/user_profile.entity';
import { CategoryEntity } from 'src/contexts/ressource/category/entities/category.entity';
import { OneToMany } from 'typeorm';
import { ClaimEntity } from '../../claims/entities/claim.entity';

export type ItemStatus = 'LOST' | 'FOUND';

@Entity('items')
export class ItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 120 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Index()
  @Column({ type: 'varchar', length: 10 })
  status: ItemStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => UserProfileEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_profile_id' })
  ownerProfile: UserProfileEntity;

  @Column({ name: 'owner_profile_id', type: 'uuid' })
  ownerProfileId: string;

  @ManyToOne(() => CategoryEntity, (c) => c.items, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' }) 
  category: CategoryEntity;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @OneToMany(() => ClaimEntity, (c) => c.item)
 claims: ClaimEntity[];

}
