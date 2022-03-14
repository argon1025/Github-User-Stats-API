import { Controller, Get, Param, Scope } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FetchingUserNameDto } from './dto/stats.dto';

@Controller({ path: 'stats', scope: Scope.REQUEST })
@ApiTags('UserStats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get(':username')
  @ApiOperation({ summary: 'Request User Stats data' })
  @ApiParam({
    name: 'username',
    type: String,
    required: true,
    description: 'Github UserName',
  })
  async userStats(@Param() fetchingUserNameDto: FetchingUserNameDto) {
    return this.statsService.userStats(fetchingUserNameDto);
  }

  @Get(':username/top-language')
  @ApiOperation({ summary: 'Request User Top language data' })
  @ApiParam({
    name: 'username',
    type: String,
    required: true,
    description: 'Github UserName',
  })
  topLanguageFetch(@Param() fetchingUserNameDto: FetchingUserNameDto) {
    return this.statsService.topLanguage(fetchingUserNameDto);
  }
}
