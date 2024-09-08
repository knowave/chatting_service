import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MysqlModule } from './database/mysql/mysql.module';
import { MongoDbModule } from './database/mongo/mongo-db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MysqlModule,
    MongoDbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
