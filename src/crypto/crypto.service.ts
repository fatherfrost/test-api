import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import axios, { AxiosResponse } from 'axios';

type MexcApiResponse<T> = {
  success: boolean;
  code: number;
  message: string;
  data: T;
};

type OrderSubmitData = {
  orderId: string;
  symbol: string;
  price: number;
  vol: number;
  leverage: number;
  side: number;
  state: number;
};

type ShortSubmitData = {
  orderId: string;
  symbol: string;
  price: number;
  vol: number;
  leverage: number;
  side: number;
  state: number;
};

type WithdrawalSubmitData = {
  coin: string;
  network: string;
  amount: number;
  address: string;
  timestamp: number;
  signature: string;
};

type CreateOrderArgs = {
  symbol: string;
  quantity: number;
  price: number;
  side: 'BUY' | 'SELL';
};

type CreateWithdrawalArgs = {
  coin: string;
  network: string;
  amount: number;
  address: string;
};

type CreateShortArgs = {
  symbol: string;
  price: number;
  leverage: number;
  volume: number;
};

@Injectable()
export class CryptoService {
  private readonly API_KEY = 'some_api_key';
  private readonly SECRET_KEY = 'some_secret';
  private trade_base_url = 'https://api.mexc.com';
  private readonly BASE_URL = 'https://contract.mexc.com';

  private getSignature(params: Record<string, any>): string {
    const sorted = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join('&');
    return crypto
      .createHmac('sha256', this.SECRET_KEY)
      .update(sorted)
      .digest('hex');
  }

  private async privateRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: Record<string, any>,
  ): Promise<T> {
    const timestamp = Date.now();
    const params = {
      ...data,
      apiKey: this.API_KEY,
      reqTime: timestamp,
    };
    params['sign'] = this.getSignature(params);

    const url = `${this.BASE_URL}${endpoint}`;
    const headers = { 'Content-Type': 'application/json' };

    const response: AxiosResponse<MexcApiResponse<T>> = await axios({
      url,
      method,
      headers,
      data: method !== 'GET' ? params : undefined,
      params: method === 'GET' ? params : undefined,
    });
    return response.data.data;
  }

  async createOrder({
    symbol,
    quantity,
    price,
    side,
  }: CreateOrderArgs): Promise<OrderSubmitData> {
    const data = {
      symbol: `${symbol}USDT`,
      side,
      type: 'LIMIT',
      price,
      quantity,
      timeInForce: 'GTC',
    };

    try {
      return await this.privateRequest<OrderSubmitData>(
        'POST',
        '/api/v3/order',
        data,
      );
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  async createWithdrawal({
    coin,
    address,
    network,
    amount,
  }: CreateWithdrawalArgs): Promise<WithdrawalSubmitData> {
    const data = {
      coin,
      network,
      amount,
      address,
      timestamp: Date.now(),
    };

    try {
      return await this.privateRequest<WithdrawalSubmitData>(
        'POST',
        '/api/v3/capital/withdraw',
        data,
      );
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  async openShortLimitOrder({
    symbol,
    price,
    leverage,
    volume,
  }: CreateShortArgs): Promise<ShortSubmitData> {
    // Крок 1. Встановлюємо плечe x1
    await this.privateRequest('POST', '/api/v1/position/change-leverage', {
      symbol,
      leverage,
      positionType: 1, // cross margin
    });

    // Крок 2. Встановлюємо режим маржі = Cross (1)
    await this.privateRequest('POST', '/api/v1/position/change-margin-type', {
      symbol,
      marginType: 1, // 1 = cross
    });

    const data = {
      symbol,
      price,
      volume,
      side: 2, // 1 = buy, 2 = sell
      type: 1, // 1 = limit order
      openType: 1, // 1 = open, 2 = close
      positionId: 0, // auto create
      leverage,
      externalOid: `short-${Date.now()}`,
    };
    // Крок 3. Відкриваємо шорт (SELL) ордер з type = limit
    const result = await this.privateRequest<ShortSubmitData>(
      'POST',
      '/api/v1/order/submit',
      data,
    );

    console.log('Short order result:');
    console.log(result);
    return result;
  }
}
