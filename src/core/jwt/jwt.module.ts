import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtTokensService } from './jwt-tokens.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}), 
  ],
  providers: [JwtTokensService],
  exports: [JwtTokensService],
})
export class CoreJwtModule {}