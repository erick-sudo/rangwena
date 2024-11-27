import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Principal } from 'src/auth/authentication/authentication.guard';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:4000', 'https://rangwena.vercel.app'],
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private onlineUsers: Record<string, { email: string; id: string }> = {};

  constructor(private readonly userService: UsersService) {}

  afterInit(server: Server) {
    //console.log('Websocket server init...');
  }

  handleConnection(client: Socket, ...args: any[]) {
    //console.log(`JOINED: #${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const user = this.onlineUsers[client.id];
    if (user) {
      this.server.emit(`user:${user.id}:down`, user);
      delete this.onlineUsers[client.id];
    }
  }

  @SubscribeMessage('users:auth')
  async handleIdentification(
    @ConnectedSocket() client: Socket,
    @MessageBody() principal: Principal,
  ) {
    const usr = await this.userService.findById(principal.id).catch(() => null);

    if (usr) {
      this.onlineUsers[client.id] = principal;
      this.server.emit(`user:${usr.id}:up`, principal);
    }
    return usr ? principal : usr;
  }

  @SubscribeMessage('users:online')
  handleOnlineUsers() {
    return Object.values(this.onlineUsers);
  }

  @SubscribeMessage('chat:message:new')
  async handleNewMessage(@MessageBody() payload: WSChatMessage) {
    this.server.emit(
      `chat:message:new:from:${payload.from}:to:${payload.to}`,
      payload,
    );
    return payload;
  }
}

export type ConversationType = 'individual' | 'channel';

interface WSChatMessage {
  from: string;
  to: string;
  conversationType: ConversationType;
  content: string;
  time: string;
}
