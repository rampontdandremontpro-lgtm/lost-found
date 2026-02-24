import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CurrentUser } from '../auth/jwt/current-user.decorator';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profile: ProfileService) {}

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.profile.getProfileById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  me(@CurrentUser() user: any) {
    return this.profile.getProfileById(user.profileId);
  }
}