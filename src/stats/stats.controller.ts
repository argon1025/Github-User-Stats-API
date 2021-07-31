import { Controller, Get, Param, Scope } from '@nestjs/common';
import { StatsService } from './stats.service';
import { TokenManagerService } from '../tokenManager/tokenManager.service';

@Controller({ path: 'stats', scope: Scope.REQUEST })
export class StatsController {
  constructor(private readonly statsService: StatsService, private readonly tokenManagerService: TokenManagerService) {}
  @Get(':username')
  async statsFecher(@Param('username') username: string) {
    return await this.tokenManagerService.githubApiFetcher(username, this.statsService.statsFetch);
  }
}
