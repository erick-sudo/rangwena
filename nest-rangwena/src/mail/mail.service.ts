import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async respondToPasswordResetRequest(user: User) {
    const host = this.configService.get<string>('VUE_FRONTEND');
    const path = '/reset-password';
    const url = `${host}${path}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support.2013@rangwena.com>',
      subject: 'Reset your password',
      template: './password-reset',
      context: {
        name: user.firstName,
        url: url,
        otp: 123456,
      },
    });
  }
}
