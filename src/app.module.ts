import { Module } from '@nestjs/common';
import { ItemModule } from './item/item.module';
import { BullModule } from '@nestjs/bullmq';
import { JobController } from './item/jobs/jobs.controller';
import { QueueProcessor } from './queue/queue.processor';

@Module({
  imports: [
    ItemModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'updateQueue',
    }),
  ],
  controllers: [JobController],
  providers: [QueueProcessor],
})
export class AppModule {}
