import { Module } from '@nestjs/common';
import { QueueProcessor } from './queue.processor';
import { ItemModule } from '../item/item.module';

@Module({
  imports: [ItemModule],
  providers: [QueueProcessor],
})
export class QueueModule {}
