import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from '../queue/queue.service';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'updateQueue',
    }),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class SharedModule {}
