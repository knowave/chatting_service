import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MysqlModule } from './database/mysql/mysql.module';
import { MongoDbModule } from './database/mongo/mongo-db.module';
import { UserModule } from './user/user.module';
import { ChatGateway } from './chat/chat.gateway';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MysqlModule,
    MongoDbModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
