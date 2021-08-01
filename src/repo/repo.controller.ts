import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TokenManagerService } from 'src/tokenManager/tokenManager.service';
import { RepoService } from './repo.service';

@Controller('repositories')
export class RepoController {
  constructor(private readonly repoService: RepoService, private readonly tokenManagerService: TokenManagerService) {}

  @Get(':reponame/user/:username')
  @ApiTags('repositories')
  @ApiOperation({ summary: 'Request Repositories data' })
  @ApiParam({
    name: 'reponame',
    type: 'string',
    required: true,
    description: 'Github User repositories Name',
  })
  @ApiParam({
    name: 'username',
    type: 'string',
    required: true,
    description: 'Github UserName',
  })
  repoFetch(@Param('reponame') reponame, @Param('username') username) {
    return this.tokenManagerService.githubApiFetcher(reponame, username);
  }

  @Get(':username')
  @ApiTags('repositories')
  @ApiOperation({ summary: 'Request All Repositories data' })
  @ApiParam({
    name: 'reponame',
    type: 'string',
    required: true,
    description: 'Github User repositories Name',
  })
  @ApiParam({
    name: 'username',
    type: 'string',
    required: true,
    description: 'Github UserName',
  })
  allrepoFetch(@Param('reponame') reponame, @Param('username') username) {
    return this.tokenManagerService.githubApiFetcher(username, this.repoService.allrepoFetch);
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
  PinnedRepoFetch(@Param('username') username: string) {
    return this.tokenManagerService.githubApiFetcher(username, this.repoService.PinnedRepoFetch);
  }
}
