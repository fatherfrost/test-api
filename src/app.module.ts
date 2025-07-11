import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';
import { CryptoModule } from './crypto/crypto.module';
import { CryptoController } from './crypto/crypto.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      retryAttempts: 10,
      retryDelay: 20000,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CryptoModule,
  ],
  controllers: [CryptoController],
})
export class AppModule {}
