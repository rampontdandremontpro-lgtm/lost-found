import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { MailerService } from 'src/core/mailers/mailer.service';
import { buildWelcomeEmailTemplate } from '../mailers/mailer.template';
import { UserRegisteredEvent, type UserRegisteredPayload } from '../events/user-registered.event';

@Injectable()
export class SendUserRegisteredEmailHandler {
  private readonly logger = new Logger(SendUserRegisteredEmailHandler.name);

  constructor(private readonly mailer: MailerService) {}

  @OnEvent(UserRegisteredEvent.EVENT_NAME, { async: true })
  async handle(payload: UserRegisteredPayload) {
    await this.mailer.send({
      to: payload.email,
      subject: 'Bienvenue sur Lost & Found 🎉',
      html: buildWelcomeEmailTemplate({ username: payload.username }),
    });

    this.logger.log(`Welcome email sent to ${payload.email}`);
  }
}