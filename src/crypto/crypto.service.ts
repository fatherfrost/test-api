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

type CreateOrderArgs = {
  symbol: string;
  quantity: number;
  price: number;
  side: 'BUY' | 'SELL';
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

  async createOrder({
    symbol,
    quantity,
    price,
    side,
  }: CreateOrderArgs): Promise<OrderSubmitData> {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        symbol: `${symbol}USDT`,
        side,
        type: 'LIMIT',
        price,
        quantity,
        timeInForce: 'GTC',
      },
    };

    try {
      const response = await axios(
        `${this.trade_base_url}/api/v3/order`,
        requestOptions,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

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

  private async privatePost(
    endpoint: string,
    body: Record<string, any>,
  ): Promise<ShortSubmitData> {
    const timestamp = Date.now();
    const params = {
      ...body,
      apiKey: this.API_KEY,
      reqTime: timestamp,
    };
    params['sign'] = this.getSignature(params);

    const url = `${this.BASE_URL}${endpoint}`;
    const headers = { 'Content-Type': 'application/json' };

    const res: AxiosResponse<MexcApiResponse<OrderSubmitData>> =
      await axios.post(url, params, { headers });

    return res.data.data;
  }

  async openShortLimitOrder({
    symbol,
    price,
    leverage,
    volume,
  }: CreateShortArgs): Promise<ShortSubmitData> {
    // Крок 1. Встановлюємо плечe x1
    await this.privatePost('/api/v1/position/change-leverage', {
      symbol,
      leverage,
      positionType: 1, // cross margin
    });

    // Крок 2. Встановлюємо режим маржі = Cross (1)
    await this.privatePost('/api/v1/position/change-margin-type', {
      symbol,
      marginType: 1, // 1 = cross
    });

    // Крок 3. Відкриваємо шорт (SELL) ордер з type = limit
    const result = await this.privatePost('/api/v1/order/submit', {
      symbol,
      price,
      volume,
      side: 2, // 1 = buy, 2 = sell
      type: 1, // 1 = limit order
      openType: 1, // 1 = open, 2 = close
      positionId: 0, // auto create
      leverage,
      externalOid: `short-${Date.now()}`,
    });

    console.log('Short order result:');
    console.log(result);
    return result;
  }
}
