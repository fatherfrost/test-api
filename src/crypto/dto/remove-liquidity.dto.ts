import { IsBoolean, IsNumber, IsString, IsArray } from 'class-validator';

export class RemoveLiquidityDto {
  @IsString()
  position: string;

  @IsString()
  userPubkey: string;

  @IsNumber()
  fromBinId: number;

  @IsNumber()
  toBinId: number;

  @IsArray()
  liquiditiesBpsToRemove: number[];

  @IsBoolean()
  shouldClaimAndClose: boolean;
}
