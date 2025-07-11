export class CreateOrderDto {
  symbol: string;
  price: number;
  quantity: number;
  side: 'BUY' | 'SELL';
}
