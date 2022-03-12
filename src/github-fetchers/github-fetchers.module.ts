import { Module } from '@nestjs/common';
import { GithubFetchersService } from './github-fetchers.service';
import { HttpModule } from '@nestjs/axios';
import { TokenManagerService } from 'src/tokenManager/tokenManager.service';

@Module({
  imports: [HttpModule],
  providers: [GithubFetchersService, TokenManagerService],
})
export class GithubStatsModule {}
