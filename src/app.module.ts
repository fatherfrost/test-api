import { Module } from '@nestjs/common';
import { ItemModule } from './item/item.module';
import { SharedModule } from './shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueModule } from './queue/queue.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { JobsController } from './item/jobs/jobs.controller';
import * as process from 'node:process';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      retryAttempts: 10,
      retryDelay: 20000,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
          ? parseInt(process.env.REDIS_PORT, 10)
          : 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'updateQueue',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    ItemModule,
    QueueModule,
  ],
  controllers: [JobsController],
})
export class AppModule {}
