import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TokenManagerService } from '../tokenManager/tokenManager.service';

@Module({
  controllers: [StatsController],
  providers: [StatsService, TokenManagerService],
})
export class StatsModule {}
