import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { WSChatMessage } from './chat.gateway';

@Processor('chats')
export class ChatConsumer extends WorkerHost {
  async process(
    job: Job<WSChatMessage, any, string>,
    token?: string,
  ): Promise<any> {
    const data = job.data;
    console.log(`---------------${job.name}-------------------`);
    console.log(data);
    console.log('----------------------------------');
    return {
      processed: 'JOB#' + data.from,
    };
  }
}
