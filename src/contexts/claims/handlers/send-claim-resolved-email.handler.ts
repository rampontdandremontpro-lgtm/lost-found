import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailerService } from 'src/core/mailers/mailer.service';
import { ClaimResolvedEvent, type ClaimResolvedPayload } from '../events/claim-resolved.event';
import { buildClaimResolvedEmailTemplate } from '../mailers/claim-resolved.template';

@Injectable()
export class SendClaimResolvedEmailHandler {
  private readonly logger = new Logger(SendClaimResolvedEmailHandler.name);

  constructor(private readonly mailer: MailerService) {}

  @OnEvent(ClaimResolvedEvent.EVENT_NAME, { async: true })
  async handle(payload: ClaimResolvedPayload) {
    await this.mailer.send({
      to: payload.requesterEmail,
      subject:
        payload.resolution === 'ACCEPTED'
          ? `✅ Réclamation acceptée : ${payload.itemTitle}`
          : `❌ Réclamation refusée : ${payload.itemTitle}`,
      html: buildClaimResolvedEmailTemplate({
        itemTitle: payload.itemTitle,
        resolution: payload.resolution,
        ownerUsername: payload.ownerUsername,
        ownerMessage: payload.ownerMessage,
      }),
      text:
        payload.resolution === 'ACCEPTED'
          ? `Votre réclamation a été acceptée pour "${payload.itemTitle}".`
          : `Votre réclamation a été refusée pour "${payload.itemTitle}".`,
    });

    this.logger.log(`Claim resolved email sent to ${payload.requesterEmail}`);
  }
}