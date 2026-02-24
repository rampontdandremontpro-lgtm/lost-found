import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';

import { ClaimEntity } from './entities/claim.entity';
import { ItemEntity } from '../items/entities/item.entity';
import { UserProfileEntity } from '../profile/entities/user_profile.entity';

import { SendItemClaimedEmailHandler } from './handlers/send-item-claimed-email.handler';
import { SendClaimResolvedEmailHandler } from './handlers/send-claim-resolved-email.handler';

import { MailerModule } from 'src/core/mailers/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClaimEntity, ItemEntity, UserProfileEntity]),
    MailerModule, 
  ],
  controllers: [ClaimsController],
  providers: [
    ClaimsService,
    SendItemClaimedEmailHandler,
    SendClaimResolvedEmailHandler,
  ],
})
export class ClaimsModule {}