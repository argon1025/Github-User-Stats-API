import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RepoService } from './repo.service';

@Controller('repo')
export class RepoController {
  constructor(private readonly repoService: RepoService) {}

  @Get(':username')
  @ApiTags('repositories')
  @ApiOperation({ summary: 'Request Repositories data' })
  @ApiQuery({
    name: 'reponame',
    type: 'string',
    required: false,
    description: 'Github User repositories Name',
  })
  @ApiParam({
    name: 'username',
    type: 'string',
    required: true,
    description: 'Github UserName',
  })
  repo(@Query('reponame') reponame, @Param('username') username) {
    if (!reponame) return this.repoService.allRepos(username);
    return this.repoService.repo(username, reponame);
  }

  @Get(':username/pinned-repositories')
  @ApiTags('repositories')
  @ApiOperation({ summary: 'Request pinned Repositories data' })
  @ApiParam({
    name: 'username',
    type: 'string',
    required: true,
    description: 'Github UserName',
  })
  pinnedRepo(@Param('username') username: string) {
    return this.repoService.pinnedRepo(username);
  }
}
