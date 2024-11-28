import { Module } from '@nestjs/common';
import { ChatConsumer } from './chat.consumer';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { UsersService } from 'src/users/users.service';
import { BullModule } from '@nestjs/bullmq';
import { OtpService } from 'src/otp/otp.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'chats',
    }),
  ],
  providers: [
    ChatGateway,
    ChatService,
    ChatConsumer,
    UsersService,
    OtpService,
    PrismaService,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
