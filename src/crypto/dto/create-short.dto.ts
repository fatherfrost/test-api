import { IsNumber, IsString } from 'class-validator';

export class CreateShortDto {
  @IsString()
  symbol: string;

  @IsNumber()
  price: number;

  @IsNumber()
  leverage: number;

  @IsNumber()
  volume: number;
}
