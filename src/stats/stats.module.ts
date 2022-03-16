import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { CacheManagerModule } from 'src/cache-manager/cache-manager.module';
import { GithubFetchersModule } from 'src/github-fetchers/github-fetchers.module';

@Module({
  imports: [HttpModule, CacheManagerModule, GithubFetchersModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
