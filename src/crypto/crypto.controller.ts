import { Controller, Post, Body } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { CreateShortDto } from './dto/create-short.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('items')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Post('/order') async createOrder(@Body() config: CreateOrderDto) {
    const result = await this.cryptoService.createOrder(config);
    return { message: 'Short position created', result };
  }

  @Post('/short') async createShort(@Body() config: CreateShortDto) {
    const result = await this.cryptoService.openShortLimitOrder(config);
    return { message: 'Short position created', result };
  }
}
