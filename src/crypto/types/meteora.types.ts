import { PublicKey, Transaction } from '@solana/web3.js';

export type StrategyParams = {
  minBinId: number;
  maxBinId: number;
  strategyType: number; // використовуйте StrategyType enum (імпортувати окремо)
};

export type AddLiquidityParams = {
  userPubkey: PublicKey;
  positionPubkey: PublicKey;
  totalXAmount: number;
  totalYAmount: number;
  strategy: StrategyParams;
};

export type RemoveLiquidityParams = {
  position: PublicKey;
  userPubkey: PublicKey;
  fromBinId: number;
  toBinId: number;
  liquiditiesBpsToRemove: number[];
  shouldClaimAndClose: boolean;
};

export type MexcApiResponse<T> = {
  success: boolean;
  code: number;
  message: string;
  data: T;
};

export type OrderSubmitData = {
  orderId: string;
  symbol: string;
  price: number;
  vol: number;
  leverage: number;
  side: number;
  state: number;
};

export type ShortSubmitData = {
  orderId: string;
  symbol: string;
  price: number;
  vol: number;
  leverage: number;
  side: number;
  state: number;
};

export type WithdrawalSubmitData = {
  coin: string;
  network: string;
  amount: number;
  address: string;
  timestamp: number;
  signature: string;
};

export type CreateOrderArgs = {
  symbol: string;
  quantity: number;
  price: number;
  side: 'BUY' | 'SELL';
};

export type CreateWithdrawalArgs = {
  coin: string;
  network: string;
  amount: number;
  address: string;
};

export type CreateShortArgs = {
  symbol: string;
  price: number;
  leverage: number;
  volume: number;
};

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type TxOrTxs = Transaction | Transaction[];
