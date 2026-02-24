export type MailerSendParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};
