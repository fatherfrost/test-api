import { Controller, Post, Body } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { CreateShortDto } from './dto/create-short.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';

@Controller('items')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Post('/order') async createOrder(@Body() config: CreateOrderDto) {
    const result = await this.cryptoService.createOrder(config);
    return { message: 'Order created', result };
  }

  @Post('/short') async createShort(@Body() config: CreateShortDto) {
    const result = await this.cryptoService.openShortLimitOrder(config);
    return { message: 'Short position created', result };
  }

  @Post('/withdraw') async withdraw(@Body() config: CreateWithdrawalDto) {
    const result = await this.cryptoService.createWithdrawal(config);
    return { message: 'Withdraw requested', result };
  }
}
