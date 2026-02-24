import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { CurrentUser } from './jwt/current-user.decorator';
import type { JwtAppPayload } from 'src/core/jwt/jwt-tokens.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@CurrentUser() user: JwtAppPayload) {
    return this.auth.logout(user.sub);
  }
}