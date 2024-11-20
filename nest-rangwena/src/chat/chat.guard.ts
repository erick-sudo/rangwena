import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { SESSION_KEY } from 'src/auth/authentication/authentication.controller';

@Injectable()
export class ChatGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket = context.switchToWs().getClient<Socket>();

    const request = socket.request;

    console.log('HEADERS: ', request.headers);

    return true;
  }

  // Extract the 'Bearer' token from http request headers
  private extractTokenFromHeaderOrCookie(
    request: IncomingMessage,
  ): string | undefined {
    const [realm, token] = request.headers.authorization?.split(' ') ?? [];
    console.log(`Realm: ${realm}, V: ${token}`);
    return realm === 'Bearer' ? token : 'NONE'; // request.cookies[SESSION_KEY] || undefined;
  }
}
