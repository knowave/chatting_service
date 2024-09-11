import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatService } from './chat.service';
import { v4 as uuid } from 'uuid';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  // client가 message를 전송할 때 처리
  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: CreateChatDto) {
    const chatDto = {
      ...data,
      messageId: uuid(), // uuid로 messageId 생성
    };

    // 채팅 메시지를 저장
    const chat = await this.chatService.createChat(chatDto);

    // 메시지를 같은 roomId에 있는 클라이언트에게 전송
    this.server.to(data.roomId).emit('newMessage', chat);
  }

  // client가 room에 입장할 때 처리
  @SubscribeMessage('joinRoom')
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (!roomId) {
      client.emit('error', 'Invalid roomId');
      this.logger.warn(
        `Client ${client.id} attempted to join with an invalid roomId`,
      );
      return;
    }

    client.join(roomId);
    this.logger.log(`Client ${client.id} joined room ${roomId}`);
    client.emit('joinedRoom', roomId);
  }

  // client가 room을 퇴장할 떄 처리
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (!roomId) {
      client.emit('error', 'Invalid roomId');
      this.logger.warn(
        `Client ${client.id} attempted to leave with an invalid roomId`,
      );
      return;
    }

    client.leave(roomId);
    this.logger.log(`Client ${client.id} left room ${roomId}`);
    client.emit('leftRoom', roomId);
  }

  // 다른 사용자에게 타이핑 중이란 것을 알림.
  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() { roomId, userId }: { roomId: string; userId: number },
  ) {
    this.server.to(roomId).emit('userTyping', { userId });
  }
}
