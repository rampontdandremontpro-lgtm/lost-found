import { Column, CreateDateColumn, Entity, Index, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserProfileEntity } from '../../profile/entities/user_profile.entity';

@Entity('user_credentials')
export class UserCredentialsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Index({ unique: true })
  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'refresh_token_hash', type: 'varchar', length: 255, nullable: true })
  refreshTokenHash: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => UserProfileEntity, (p) => p.credentials)
  profile: UserProfileEntity;
}