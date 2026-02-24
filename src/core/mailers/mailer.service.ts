import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';
import type { MailerSendParams } from './mailer.type';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private readonly transporter: Transporter;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('MAIL_HOST');
    const port = Number(this.config.get<string>('MAIL_PORT', '587'));
    const secure = this.config.get<string>('MAIL_SECURE', 'false') === 'true';
    const user = this.config.get<string>('MAIL_USER');
    const pass = this.config.get<string>('MAIL_PASS');

    this.logger.log(
  `Mailer config loaded? host=${host} user=${user ? 'YES' : 'NO'} pass=${pass ? 'YES' : 'NO'}`
);


    if (!host || !user || !pass) {
      this.logger.warn('MAIL_* config is missing. Emails will not be sent.');
      this.transporter = nodemailer.createTransport({ jsonTransport: true });
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  async send(params: MailerSendParams): Promise<void> {
    const from = this.config.get<string>('MAIL_FROM') ?? this.config.get<string>('MAIL_USER') ?? 'no-reply@lostfound.local';

    try {
      await this.transporter.sendMail({
        from,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
      });

      this.logger.log(`Email sent to ${params.to}: ${params.subject}`);
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${params.to}`, err?.stack ?? err);
    }
  }
}
