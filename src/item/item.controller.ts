import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { QueueService } from '../queue/queue.service';
import { DeleteItemDto } from './dto/delete-item.dto';

@Controller('items')
export class ItemController {
  constructor(
    private readonly queueService: QueueService,
    private readonly itemService: ItemService,
  ) {}

  @Post() async create(@Body() records: CreateItemDto[]) {
    const jobId = await this.queueService.addBulkCreateJob(records);
    return { message: 'Create started', jobId };
  }

  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.itemService.findOne(id);
  }

  @Patch()
  async updateBulk(@Body() records: UpdateItemDto[]) {
    const jobId = await this.queueService.addBulkUpdateJob(records);
    return { message: 'Update started', jobId };
  }

  @Delete()
  async delete(@Body() records: DeleteItemDto[]) {
    const jobId = await this.queueService.addBulkDeleteJob(records);
    return { message: 'Delete started', jobId };
  }
}
