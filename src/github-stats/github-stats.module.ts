import { Module } from '@nestjs/common';
import { GithubStatsService } from './github-stats.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [GithubStatsService],
})
export class GithubStatsModule {}
