import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ItemEntity } from '../../items/entities/item.entity';

export type ClaimStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

@Entity('claims')
@Index(['requesterProfileId', 'status'])
export class ClaimEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ItemEntity, (i) => i.claims, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: ItemEntity;

  @Column({ name: 'item_id', type: 'uuid' })
  itemId: string;

  @Column({ name: 'requester_profile_id', type: 'uuid' })
  requesterProfileId: string;

  @Column({ name: 'target_profile_id', type: 'uuid' })
  targetProfileId: string;

  @Column({ name: 'message', type: 'text' })
  message: string;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'PENDING' })
  status: ClaimStatus;

  @Column({ name: 'resolved_message', type: 'text', nullable: true })
  resolvedMessage: string | null;

  @Column({ name: 'resolved_at', type: 'datetime', nullable: true })
  resolvedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}