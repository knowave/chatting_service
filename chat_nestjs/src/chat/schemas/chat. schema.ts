import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type chatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop()
  userId: number;

  @Prop()
  roomId: number;

  @Prop()
  messageId: number;

  @Prop()
  username: string;

  @Prop()
  content: string;
}
