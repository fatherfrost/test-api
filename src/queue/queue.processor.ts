import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { CreateItemDto } from '../item/dto/create-item.dto';
import { UpdateItemDto } from '../item/dto/update-item.dto';
import { DeleteItemDto } from '../item/dto/delete-item.dto';

interface JobData {
  records: CreateItemDto[] | UpdateItemDto[] | DeleteItemDto[];
}

@Injectable()
@Processor('updateQueue')
export class QueueProcessor extends WorkerHost {
  private readonly BATCH_SIZE = 100;
  private readonly CONCURRENT_BATCHES = 3;
  private readonly BATCH_INTERVAL = 1000;
  private readonly CONCURRENT_OPERATIONS = 10;

  async process(job: Job<JobData>): Promise<void> {
    const {
      name,
      data: { records },
    } = job;

    const updateProgress = async (completed: number) => {
      await job.updateProgress((completed / records.length) * 100);
    };

    switch (name) {
      case 'bulkCreateJob':
        await this.processBulkCreate(
          records as CreateItemDto[],
          updateProgress,
        );
        break;
      case 'bulkUpdateJob':
        await this.processBulkUpdate(
          records as UpdateItemDto[],
          updateProgress,
        );
        break;
      case 'bulkDeleteJob':
        await this.processBulkDelete(
          records as DeleteItemDto[],
          updateProgress,
        );
        break;
      default:
        throw new Error(`Unknown job name: ${name}`);
    }
  }

  private async processBulkCreate(
    records: CreateItemDto[],
    updateProgress: (completed: number) => Promise<void>,
  ): Promise<void> {
    const batches = this.createBatches(records);
    let completed = 0;
    await this.processBatchesWithRateLimit(batches, async (batch) => {
      await this.processOperationsWithConcurrency(batch, async (record) => {
        console.log('Creating record:', record);
        await new Promise((resolve) => setTimeout(resolve, 100));
        completed++;
        await updateProgress(completed);
      });
    });
  }

  private async processBulkUpdate(
    records: UpdateItemDto[],
    updateProgress: (completed: number) => Promise<void>,
  ): Promise<void> {
    const batches = this.createBatches(records);
    let completed = 0;
    await this.processBatchesWithRateLimit(batches, async (batch) => {
      await this.processOperationsWithConcurrency(batch, async (record) => {
        console.log('Updating record:', record);
        await new Promise((resolve) => setTimeout(resolve, 100));
        completed++;
        await updateProgress(completed);
      });
    });
  }

  private async processBulkDelete(
    records: DeleteItemDto[],
    updateProgress: (completed: number) => Promise<void>,
  ): Promise<void> {
    const batches = this.createBatches(records);
    let completed = 0;
    await this.processBatchesWithRateLimit(batches, async (batch) => {
      await this.processOperationsWithConcurrency(batch, async (record) => {
        console.log('Deleting record:', record);
        await new Promise((resolve) => setTimeout(resolve, 100));
        completed++;
        await updateProgress(completed);
      });
    });
  }

  private async processBatchesWithRateLimit<T>(
    batches: T[][],
    processor: (batch: T[]) => Promise<void>,
  ): Promise<void> {
    for (let i = 0; i < batches.length; i += this.CONCURRENT_BATCHES) {
      const batchChunk = batches.slice(i, i + this.CONCURRENT_BATCHES);
      console.log(`Processing ${batchChunk.length} batches concurrently`);

      await Promise.all(batchChunk.map(processor));

      if (i + this.CONCURRENT_BATCHES < batches.length) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.BATCH_INTERVAL),
        );
      }
    }
  }

  private async processOperationsWithConcurrency<T>(
    batch: T[],
    processor: (item: T) => Promise<void>,
  ): Promise<void> {
    for (let i = 0; i < batch.length; i += this.CONCURRENT_OPERATIONS) {
      const chunk = batch.slice(i, i + this.CONCURRENT_OPERATIONS);
      await Promise.all(chunk.map(processor));
    }
  }

  private createBatches<T>(records: T[]): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < records.length; i += this.BATCH_SIZE) {
      batches.push(records.slice(i, i + this.BATCH_SIZE));
    }
    return batches;
  }
}
