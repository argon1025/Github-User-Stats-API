import { Controller, Get, Param, Scope } from '@nestjs/common';
import { StatsService } from './stats.service';
import { TokenManagerService } from '../tokenManager/tokenManager.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { GithubStatsService } from 'src/github-stats/github-stats.service';

@Controller({ path: 'stats', scope: Scope.REQUEST })
@ApiTags('UserStats')
export class StatsController {
  constructor(private readonly statsService: StatsService, private readonly tokenManagerService: TokenManagerService, private readonly githubStatsService: GithubStatsService) {}

  @Get(':username')
  @ApiOperation({ summary: 'Request User Stats data' })
  @ApiParam({
    name: 'username',
    type: 'string',
    required: true,
    description: 'Github UserName',
  })
  async statsFecher(@Param('username') username: string) {
    return this.tokenManagerService.githubApiFetcher(username, this.githubStatsService.getUsersStats);
  }

  @Get(':username/top-language')
  @ApiOperation({ summary: 'Request User Top language data' })
  @ApiParam({
    name: 'username',
    type: 'string',
    required: true,
    description: 'Github UserName',
  })
  topLanguageFetch(@Param('username') username: string) {
    return this.tokenManagerService.githubApiFetcher(username, this.statsService.topLanguageFetch);
  }
}
