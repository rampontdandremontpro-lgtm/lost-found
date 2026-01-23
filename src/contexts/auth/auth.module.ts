import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserCredentialsEntity } from './entities/user_credentials.entity';

import { AUTH_RESPOSITORY } from './auth.repository.interface';
import { AuthRepositoryImpl } from './auth.repository';

import { PASSWORD_HASHER } from './ports/password-hasher.ports';
import { PasswordHasherService } from './password-hasher.service';
import { UserProfileEntity } from '../profile/entities/user_profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserCredentialsEntity, UserProfileEntity])],
  controllers: [AuthController],
  providers: [
    AuthService,

    { provide: AUTH_RESPOSITORY, useClass: AuthRepositoryImpl },

    { provide: PASSWORD_HASHER, useClass: PasswordHasherService },
  ],
  exports: [AuthService],
})
export class AuthModule {}
