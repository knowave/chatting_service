import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './schemas/chat.schema';
import { Model } from 'mongoose';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
  ) {}

  async createChat(createChatDto: CreateChatDto): Promise<Chat> {
    const createChat = new this.chatModel(createChatDto);
    return createChat.save();
  }

  // 특정 유저의 채팅방 목록 조회
  async getUserChatRooms(userId: number) {
    return await this.chatModel.aggregate([
      { $match: { $or: [{ userId }, { recipientId: userId }] } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$roomId',
          latestMessage: { $first: '$message' },
          recipientId: { $first: '$recipientId' },
          userId: { $first: '$userId' },
        },
      },
    ]);
  }

  // 특정 채팅방에 이전 메시지 가져오기
  async getChatHistory(roomId: string): Promise<Chat[]> {
    return await this.chatModel.find({ roomId }).sort({ createdAt: 1 }).exec();
  }
}
