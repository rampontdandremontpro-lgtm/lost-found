import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileEntity } from './entities/user_profile.entity';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([
          UserProfileEntity
      ])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
