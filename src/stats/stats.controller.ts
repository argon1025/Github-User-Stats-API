import { Controller, Get, Param, Scope } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FetchingUserNameDto, TopLanguage, UserStats } from './dto/stats.dto';
import { CacheManagerService } from 'src/cache-manager/cache-manager.service';

@Controller({ path: 'stats', scope: Scope.REQUEST })
@ApiTags('UserStats')
export class StatsController {
  constructor(private readonly cacheManagerService: CacheManagerService, private readonly statsService: StatsService) {}

  @Get(':username')
  @ApiOperation({ summary: 'Request User Stats data' })
  @ApiParam({
    name: 'username',
    type: String,
    required: true,
    description: 'Github UserName',
  })
  async userStats(@Param() fetchingUserNameDto: FetchingUserNameDto): Promise<UserStats> {
    const cacheResponse = await this.cacheManagerService.getUserStats(fetchingUserNameDto.username);
    if (cacheResponse) return cacheResponse;
    const githubResponse = await this.statsService.userStats(fetchingUserNameDto);
    await this.cacheManagerService.setUserStats(fetchingUserNameDto.username, githubResponse);
    return githubResponse;
  }

  @Get(':username/top-language')
  @ApiOperation({ summary: 'Request User Top language data' })
  @ApiParam({
    name: 'username',
    type: String,
    required: true,
    description: 'Github UserName',
  })
  async topLanguage(@Param() fetchingUserNameDto: FetchingUserNameDto): Promise<TopLanguage[]> {
    const cacheResponse = await this.cacheManagerService.getTopLanguage(fetchingUserNameDto.username);
    if (cacheResponse) return cacheResponse;
    const githubResponse = await this.statsService.topLanguage(fetchingUserNameDto);
    await this.cacheManagerService.setTopLanguage(fetchingUserNameDto.username, githubResponse);
    return githubResponse;
  }
}
