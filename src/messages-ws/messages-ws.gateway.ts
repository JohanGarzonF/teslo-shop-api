import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerCient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }
    // console.log(payload);
    // client.join('sells');

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected', client.id);
    this.messagesWsService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    //! Emit just to client

    //! Emit to all clients except the sender
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Johan',
    //   message: payload.message || 'no message',
    // });

    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Johan',
    //   message: payload.message || 'no message',
    // });

    //! Emit to all clients
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserNameBySocketId(client.id),
      message: payload.message || 'no message',
    });
  }
}
