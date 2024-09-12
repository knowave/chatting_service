import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './schemas/chat.schema';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/rooms/:roomId/history')
  async getChatHistory(@Param('roomId') roomId: string): Promise<Chat[]> {
    return this.chatService.getChatHistory(roomId);
  }

  @Get('/rooms/:userId')
  async getUserChatRooms(@Param('userId') userId: number) {
    return this.chatService.getUserChatRooms(userId);
  }
}
