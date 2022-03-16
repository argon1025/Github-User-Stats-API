import { CacheModule, Module } from '@nestjs/common';
import { CacheManagerService } from './cache-manager.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // Redis config
        const REDIS_HOST = configService.get<string>('REDIS_HOST', 'localhost');
        const REDIS_PORT = configService.get<number>('REDIS_PORT', 6379);
        return { store: redisStore, host: REDIS_HOST, port: REDIS_PORT, ttl: 600 };
      },
    }),
  ],
  providers: [CacheManagerService],
  exports: [CacheManagerService],
})
export class CacheManagerModule {}
