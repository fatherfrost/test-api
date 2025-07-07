import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, Job, JobState } from 'bullmq';

interface JobStatusResponse {
  id: string;
  status: JobState;
  progress: number;
  processedCount?: number;
  failedReason?: string;
}

@Controller('jobs')
export class JobsController {
  constructor(@InjectQueue('updateQueue') private updateQueue: Queue) {}

  @Get(':id')
  async getJobStatus(@Param('id') jobId: string): Promise<JobStatusResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const job = await this.updateQueue.getJob(jobId);

    if (!job) {
      throw new NotFoundException(`Job ${jobId} not found`);
    }

    return this.buildJobResponse(job);
  }

  private async buildJobResponse(job: Job): Promise<JobStatusResponse> {
    const status = await job.getState();

    if (!status || status === 'unknown') {
      throw new NotFoundException('Job status not available');
    }

    return {
      id: job.id ?? '',
      status,
      progress: typeof job.progress === 'number' ? job.progress : 0,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      processedCount: job.returnvalue?.processedCount,
      failedReason: job.failedReason ?? undefined,
    };
  }
}
