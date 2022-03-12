import { Controller, Get, Param, Scope } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'stats', scope: Scope.REQUEST })
@ApiTags('UserStats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get(':username')
  @ApiOperation({ summary: 'Request User Stats data' })
  @ApiParam({
    name: 'username',
    type: 'string',
    required: true,
    description: 'Github UserName',
  })
  async userStats(@Param('username') username: string) {
    return this.statsService.userStats(username);
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
    return this.statsService.topLanguage(username);
  }
}
