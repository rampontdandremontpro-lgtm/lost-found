import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { ResolveClaimDto } from './dto/resolve-claim.dto';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CurrentUser } from '../auth/jwt/current-user.decorator';
import type { JwtAppPayload } from 'src/core/jwt/jwt-tokens.service';

@Controller()
export class ClaimsController {
  constructor(private readonly claims: ClaimsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('items/:id/claims')
  create(
    @Param('id') itemId: string,
    @CurrentUser() user: JwtAppPayload,
    @Body() dto: CreateClaimDto,
  ) {
    return this.claims.create(itemId, {
      requesterProfileId: user.profileId,
      message: dto.message,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('items/:id/claims')
  list(@Param('id') itemId: string) {
    return this.claims.findByItem(itemId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('items/:itemId/claims/:claimId/accept')
  accept(
    @Param('itemId') itemId: string,
    @Param('claimId') claimId: string,
    @CurrentUser() user: JwtAppPayload,
    @Body() dto: ResolveClaimDto,
  ) {
    return this.claims.accept(
      user.profileId,
      itemId,
      claimId,
      dto.message,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('items/:itemId/claims/:claimId/reject')
  reject(
    @Param('itemId') itemId: string,
    @Param('claimId') claimId: string,
    @CurrentUser() user: JwtAppPayload,
    @Body() dto: ResolveClaimDto,
  ) {
    return this.claims.reject(
      user.profileId,
      itemId,
      claimId,
      dto.message,
    );
  }
}