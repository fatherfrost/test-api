import { Controller, Post, Body } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { CreateShortDto } from './dto/create-short.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { PublicKey } from '@solana/web3.js';
import { AddLiquidityDto } from './dto/add-liquidity.dto';
import { RemoveLiquidityDto } from './dto/remove-liquidity.dto';

@Controller('crypto')
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

  @Post('init')
  async init(@Body('poolAddress') poolAddress: string) {
    await this.cryptoService.init(poolAddress);
    return { message: 'DLMM initialized' };
  }

  @Post('/liquidity/add') async addLiquidity(@Body() data: AddLiquidityDto) {
    const txSig = await this.cryptoService.addLiquidity({
      userPubkey: new PublicKey(data.userPubkey),
      positionPubkey: new PublicKey(data.positionPubkey),
      totalXAmount: data.totalXAmount,
      totalYAmount: data.totalYAmount,
      strategy: {
        minBinId: data.strategy.minBinId,
        maxBinId: data.strategy.maxBinId,
        strategyType: data.strategy.strategyType,
      },
    });

    return { message: 'Liquidity added', txSig };
  }

  @Post('/liquidity/remove') async removeLiquidity(
    @Body() data: RemoveLiquidityDto,
  ) {
    const txSig = await this.cryptoService.removeLiquidity({
      position: new PublicKey(data.position),
      userPubkey: new PublicKey(data.userPubkey),
      fromBinId: data.fromBinId,
      toBinId: data.toBinId,
      liquiditiesBpsToRemove: data.liquiditiesBpsToRemove,
      shouldClaimAndClose: data.shouldClaimAndClose,
    });

    return { message: 'Liquidity removed', txSig };
  }
}
