import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './users.controller';
import { OtpService } from 'src/otp/otp.service';
import { MailService } from 'src/mail/mail.service';
import { OtpModule } from 'src/otp/otp.module';

@Module({
  imports: [PrismaModule, OtpModule],
  providers: [UsersService, OtpService, MailService],
  controllers: [UsersController],
})
export class UsersModule {}
