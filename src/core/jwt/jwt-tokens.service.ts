import { Injectable } from '@nestjs/common';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';

export type JwtAppPayload = {
  sub: string; 
  profileId: string;
  permissionMask: string;
};

function parseExpiresIn(value: string): number | StringValue {
  const v = value.trim();
  if (/^\d+$/.test(v)) return Number(v);
  return v as StringValue; 
}

@Injectable()
export class JwtTokensService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signAccessToken(payload: JwtAppPayload): Promise<string> {
    const secret = this.config.getOrThrow<string>('JWT_ACCESS_SECRET');
    const expiresIn = parseExpiresIn(this.config.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN'));

    const opts: JwtSignOptions = { secret, expiresIn };
    return this.jwt.signAsync(payload, opts);
  }

  async signRefreshToken(payload: JwtAppPayload): Promise<string> {
    const secret = this.config.getOrThrow<string>('JWT_REFRESH_SECRET');
    const expiresIn = parseExpiresIn(this.config.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN'));

    const opts: JwtSignOptions = { secret, expiresIn };
    return this.jwt.signAsync(payload, opts);
  }

  async verifyRefreshToken(token: string): Promise<JwtAppPayload> {
    const secret = this.config.getOrThrow<string>('JWT_REFRESH_SECRET');
    return this.jwt.verifyAsync<JwtAppPayload>(token, { secret });
  }
}