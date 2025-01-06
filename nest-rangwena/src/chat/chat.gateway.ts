import { JwtService } from '@nestjs/jwt';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SESSION_KEY } from 'src/auth/authentication/authentication.controller';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:4000'],
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  afterInit(server: Server) {
    //console.log('Websocket server init...');
  }

  handleConnection(client: Socket, ...args: any[]) {
    const sessionCookie = this.extractCookiesFromSocket(client)[SESSION_KEY];

    if (sessionCookie) {
      const decodedToken = this.jwtService.decode(sessionCookie);

      if (decodedToken?.sub) {
        this.server.emit(`user:${decodedToken.sub}:up`, {
          time: new Date().toISOString(),
        });
        // console.log(
        //   `UP:: ${decodedToken.email?.padEnd(30)} ${decodedToken.sub}`,
        // );
      }
    }
  }

  handleDisconnect(client: Socket) {
    const sessionCookie = this.extractCookiesFromSocket(client)[SESSION_KEY];
    if (sessionCookie) {
      const decodedToken = this.jwtService.decode(sessionCookie);
      if (decodedToken?.sub) {
        this.server.emit(`user:${decodedToken.sub}:down`, {
          time: new Date().toISOString(),
        });
        // console.log(
        //   `DOWN:: ${decodedToken.email?.padEnd(30)} ${decodedToken.sub}`,
        // );
      }
    }
  }

  @SubscribeMessage('chat:message:new')
  async handleNewMessage(@MessageBody() payload: WSChatMessage) {
    // this.server.emit(
    //   `chat:message:new:from:${payload.from}:to:${payload.to}`,
    //   payload,
    // );
    return payload;
  }

  extractCookiesFromSocket(client: Socket): Record<string, string> {
    return (client.handshake.headers.cookie || '').split(',').reduce(
      (acc, curr) => {
        const [k, v] = curr.split('=');
        if (k && v) {
          acc[k] = v;
        }
        return acc;
      },
      {} as Record<string, string>,
    );
  }
}

export type ConversationType = 'individual' | 'channel';

export interface WSChatMessage {
  from: string;
  to: string;
  conversationType: ConversationType;
  content: string;
  time: string;
}
