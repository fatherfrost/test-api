import { IsIn, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  symbol: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsIn(['BUY', 'SELL'])
  side: 'BUY' | 'SELL';
}
