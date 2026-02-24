import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { AUTH_RESPOSITORY } from './auth.repository.interface';
import type { AuthRepository } from './auth.repository.interface';

import { PASSWORD_HASHER } from './ports/password-hasher.ports';
import type { PasswordHasherPort } from './ports/password-hasher.ports';

import { UserProfileEntity } from '../profile/entities/user_profile.entity';
import { UserCredentialsEntity } from './entities/user_credentials.entity';

import { EmailAlreadyUsedError, InvalidCredentialsError } from './errors/auth.error';
import { ROLE_PERMS } from 'src/core/permissions/permission';

import { JwtTokensService, type JwtAppPayload } from 'src/core/jwt/jwt-tokens.service';

import { UserRegisteredEvent, type UserRegisteredPayload } from './events/user-registered.event';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_RESPOSITORY) private readonly authRepo: AuthRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasherPort,

    @InjectRepository(UserProfileEntity) private readonly profileRepo: Repository<UserProfileEntity>,
    @InjectRepository(UserCredentialsEntity) private readonly credRepo: Repository<UserCredentialsEntity>,

    private readonly tokens: JwtTokensService,

    private readonly emitter: EventEmitter2,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.authRepo.findCredentialByEmail(dto.email);
    if (existing) throw new EmailAlreadyUsedError(dto.email);

    const passwordHash = await this.passwordHasher.hash(dto.password);

    const createdCred = await this.authRepo.createCredential({
      email: dto.email,
      passwordHash,
    });

    const profile = this.profileRepo.create({
      username: dto.username,
      credentialsId: createdCred.id,
      permissionMask: ROLE_PERMS.USER.toString(),
    });

    const createdProfile = await this.profileRepo.save(profile);

    const payload: UserRegisteredPayload = {
      profileId: createdProfile.id,
      email: dto.email,
      username: createdProfile.username,
    };
    this.emitter.emit(UserRegisteredEvent.EVENT_NAME, payload);

    const tokens = await this.issueTokens({
      credentialsId: createdCred.id,
      profileId: createdProfile.id,
      permissionMask: createdProfile.permissionMask,
    });

    return {
      profile: {
        id: createdProfile.id,
        username: createdProfile.username,
        createdAt: createdProfile.createdAt,
        permissionMask: createdProfile.permissionMask,
      },
      tokens,
    };
  }

  async login(dto: LoginDto) {
    const cred = await this.authRepo.findCredentialByEmail(dto.email);
    if (!cred) throw new InvalidCredentialsError();

    const ok = await this.passwordHasher.compare(dto.password, cred.passwordHash);
    if (!ok) throw new InvalidCredentialsError();

    const profile = await this.profileRepo.findOne({ where: { credentialsId: cred.id } });
    if (!profile) throw new InvalidCredentialsError();

    const tokens = await this.issueTokens({
      credentialsId: cred.id,
      profileId: profile.id,
      permissionMask: profile.permissionMask,
    });

    return {
      profile: {
        id: profile.id,
        username: profile.username,
        createdAt: profile.createdAt,
        permissionMask: profile.permissionMask,
      },
      tokens,
    };
  }

  async refresh(refreshToken: string) {
    const payload = await this.tokens.verifyRefreshToken(refreshToken);

    const cred = await this.credRepo.findOne({ where: { id: payload.sub } });
    if (!cred || !cred.refreshTokenHash) throw new InvalidCredentialsError();

    const ok = await this.passwordHasher.compare(refreshToken, cred.refreshTokenHash);
    if (!ok) throw new InvalidCredentialsError();

    const profile = await this.profileRepo.findOne({ where: { id: payload.profileId } });
    if (!profile) throw new InvalidCredentialsError();

    return this.issueTokens({
      credentialsId: cred.id,
      profileId: profile.id,
      permissionMask: profile.permissionMask,
    });
  }

  async logout(credentialsId: string) {
    await this.credRepo.update(credentialsId, { refreshTokenHash: null });
    return { loggedOut: true };
  }

  private async issueTokens(params: { credentialsId: string; profileId: string; permissionMask: string }) {
    const payload: JwtAppPayload = {
      sub: String(params.credentialsId),
      profileId: String(params.profileId),
      permissionMask: String(params.permissionMask),
    };

    const accessToken = await this.tokens.signAccessToken(payload);
    const refreshToken = await this.tokens.signRefreshToken(payload);

    const refreshTokenHash = await this.passwordHasher.hash(refreshToken);
    await this.credRepo.update(params.credentialsId, { refreshTokenHash });

    return { accessToken, refreshToken };
  }
}