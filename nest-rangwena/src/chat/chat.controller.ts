import { Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Public } from 'src/decorators/route.decorator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @Public()
  async create() {
    await this.chatService.queueChat({
      from: 'sender',
      to: 'destination',
      conversationType: 'individual',
      content: 'He sells sea shells at the sea shore',
      time: new Date().toISOString(),
    });

    return {
      ack: 'Message Sent',
    };
  }
}
