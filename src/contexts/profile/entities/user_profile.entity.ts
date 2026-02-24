import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserCredentialsEntity } from '../../auth/entities/user_credentials.entity';

@Entity('user_profiles')
export class UserProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'username', type: 'varchar', length: 50 })
  username: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => UserCredentialsEntity, (c) => c.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'credentials_id' })
  credentials: UserCredentialsEntity;

  @Column({ name: 'credentials_id', type: 'uuid' })
  credentialsId: string;

  @Column({
    name: 'permission_mask',
    type: 'bigint',
    default: '0',
  })
  permissionMask: string;
}