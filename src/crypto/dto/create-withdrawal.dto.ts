import { IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class CreateWithdrawalDto {
  @IsString()
  coin: string;

  @IsString()
  network: string;

  @IsString()
  address: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
