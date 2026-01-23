import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfileEntity } from './entities/user_profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserProfileEntity)
    private readonly profileRepo: Repository<UserProfileEntity>,
  ) {}

  async getProfileById(id: string) {
    const profile = await this.profileRepo.findOne({
      where: { id },
      // relations: { credentials: true }, // optionnel
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // profil public
    return {
      id: profile.id,
      username: profile.username,
      createdAt: profile.createdAt,
      credentialsId: profile.credentialsId,
    };
  }
}
