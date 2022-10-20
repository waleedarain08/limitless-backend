import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(to: string, subject: string, context: any, template: string) {
    try {
      console.log('Sending mail to: ', to);
      await this.mailerService.sendMail({
        to,
        subject,
        template: `./${template}`,
        context,
      });
      console.log('Mail sended successfully to: ', to);
    } catch (err) {
      console.log({ err });
      throw err;
    }
  }
}
