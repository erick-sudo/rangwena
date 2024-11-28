import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { WSChatMessage } from './chat.gateway';

@Injectable()
export class ChatService {
  constructor(@InjectQueue('chats') private audioQueue: Queue) {}

  async queueChat(chat: WSChatMessage) {
    const job = await this.audioQueue.add('new-chat', chat);
  }
}
