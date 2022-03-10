import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TokenManagerService } from '../tokenManager/tokenManager.service';
import { GithubFetchersService } from 'src/github-fetchers/github-fetchers.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [StatsController],
  providers: [StatsService, TokenManagerService, GithubFetchersService],
})
export class StatsModule {}
