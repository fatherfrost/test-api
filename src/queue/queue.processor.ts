import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('updateQueue')
export class QueueProcessor extends WorkerHost {
  async process(job: Job) {
    const { records } = job.data;
    for (const record of records) {
      this.updateSingleRecord(record);
    }
  }

  private updateSingleRecord(record: any) {
    console.log('Оновлюється запис:', record.id);
    // await this.dbService.update(record);
  }
}
