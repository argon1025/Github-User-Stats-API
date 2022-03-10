import { Module } from '@nestjs/common';
import { GithubFetchersService } from './github-fetchers.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [GithubFetchersService],
})
export class GithubStatsModule {}
