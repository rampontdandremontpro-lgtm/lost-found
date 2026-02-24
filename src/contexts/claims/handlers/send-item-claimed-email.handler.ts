import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailerService } from 'src/core/mailers/mailer.service';
import { ItemClaimedEvent, type ItemClaimedPayload } from '../events/item-claimed.event';
import { buildClaimEmailTemplate } from '../mailers/claim.template';

@Injectable()
export class SendItemClaimedEmailHandler {
  private readonly logger = new Logger(SendItemClaimedEmailHandler.name);

  constructor(private readonly mailer: MailerService) {}

  @OnEvent(ItemClaimedEvent.EVENT_NAME, { async: true })
  async handle(payload: ItemClaimedPayload) {
    await this.mailer.send({
      to: payload.targetEmail,
      subject:
        payload.itemStatus === 'FOUND'
          ? `Réclamation sur votre objet trouvé : ${payload.itemTitle}`
          : `Match possible sur votre objet perdu : ${payload.itemTitle}`,
      html: buildClaimEmailTemplate({
        itemTitle: payload.itemTitle,
        itemStatus: payload.itemStatus,
        requesterUsername: payload.requesterUsername,
        message: payload.message,
      }),
      text: `${payload.requesterUsername} a envoyé une demande: ${payload.message}`,
    });

    this.logger.log(`Claim email sent to ${payload.targetEmail}`);
  }
}