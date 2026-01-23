import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AUTH_RESPOSITORY } from './auth.repository.interface';
import type { AuthRepository } from './auth.repository.interface';

import { PASSWORD_HASHER } from './ports/password-hasher.ports';
import type { PasswordHasherPort } from './ports/password-hasher.ports';
import { UserProfileEntity } from '../profile/entities/user_profile.entity';


@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_RESPOSITORY) private readonly authRepo: AuthRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasherPort,
    @InjectRepository(UserProfileEntity) private readonly profileRepo: Repository<UserProfileEntity>,
  ) {}

async register(dto: RegisterDto) {
  const existing = await this.authRepo.findCredentialByEmail(dto.email);
  if (existing) {
    throw new BadRequestException('Email already used');
  }

  const passwordHash = await this.passwordHasher.hash(dto.password);

  const createdCred = await this.authRepo.createCredential({
    email: dto.email,
    passwordHash,
  });

  const profile = this.profileRepo.create({
    username: dto.username,
    credentialsId: createdCred.id,
  });

  const createdProfile = await this.profileRepo.save(profile);

  return {
    credentialsId: createdCred.id,
    profileId: createdProfile.id,
    email: createdCred.email,
    username: createdProfile.username,
    createdAt: createdProfile.createdAt,
  };
}
  async login(dto: LoginDto) {
    const credential = await this.authRepo.findCredentialByEmail(dto.email);
    if (!credential) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await this.passwordHasher.compare(dto.password, credential.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      message: 'Login OK',
      userId: credential.id,
      token: `fake-token-${credential.id}-${Date.now()}`,
    };
  }
}
