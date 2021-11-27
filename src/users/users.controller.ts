import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { TokenManagerService } from '../tokenManager/tokenManager.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly tokenManagerService: TokenManagerService) {}
  @Get(':username/weekly-stats')
  @ApiOperation({ summary: 'Request weekly-stats data' })
  @ApiParam({
    name: 'username',
    type: 'string',
    required: true,
    description: 'Github UserName',
  })
  weeklystats(@Param('username') username: string) {
    return this.tokenManagerService.githubApiFetcher(username, this.usersService.weeklyStats);
  }

  @Get(':username/events/page/:page')
  @ApiOperation({ summary: 'Request all events data' })
  @ApiParam({
    name: 'username',
    type: 'string',
    required: true,
    description: 'Github UserName',
  })
  @ApiParam({
    name: 'page',
    type: 'string',
    required: true,
    description: 'page',
  })
  allEvents(@Param('username') username: string, @Param('page') page: string) {
    return this.tokenManagerService.githubApiFetcher(username, this.usersService.allEvents, page);
  }
}
