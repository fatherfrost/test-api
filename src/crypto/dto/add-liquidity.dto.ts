import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class StrategyDto {
  @IsNumber()
  minBinId: number;

  @IsNumber()
  maxBinId: number;

  @IsNumber()
  strategyType: number;
}

export class AddLiquidityDto {
  @IsString()
  userPubkey: string;

  @IsString()
  positionPubkey: string;

  @IsNumber()
  totalXAmount: number;

  @IsNumber()
  totalYAmount: number;

  @ValidateNested()
  @Type(() => StrategyDto)
  strategy: StrategyDto;
}
