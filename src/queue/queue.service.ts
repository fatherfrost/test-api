import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { UpdateItemDto } from '../item/dto/update-item.dto';
import { CreateItemDto } from '../item/dto/create-item.dto';
import { DeleteItemDto } from '../item/dto/delete-item.dto';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('updateQueue') private readonly updateQueue: Queue,
  ) {}
  async addBulkCreateJob(records: CreateItemDto[]) {
    const data = await this.updateQueue.add('bulkCreateJob', { records });
    return data.name;
  }

  async addBulkUpdateJob(records: UpdateItemDto[]) {
    const data = await this.updateQueue.add('bulkUpdateJob', { records });
    return data.name;
  }

  async addBulkDeleteJob(records: DeleteItemDto[]) {
    const data = await this.updateQueue.add('bulkDeleteJob', { records });
    return data.name;
  }
}
