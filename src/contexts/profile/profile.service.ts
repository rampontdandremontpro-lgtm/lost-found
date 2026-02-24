import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserProfileEntity } from './entities/user_profile.entity';
import { ProfileNotFoundError } from './errors/profile.errors';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserProfileEntity)
    private readonly profileRepo: Repository<UserProfileEntity>,
  ) {}

  async getProfileById(id: string) {
    const profile = await this.profileRepo.findOne({ where: { id } });
    if (!profile) throw new ProfileNotFoundError(id);

    return {
      id: profile.id,
      username: profile.username,
      createdAt: profile.createdAt,
      credentialsId: profile.credentialsId,
    };
  }
}
