import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TokenManagerService } from 'src/tokenManager/tokenManager.service';
import { RepoService } from './repo.service';

@Controller('repo')
export class RepoController {
  constructor(private readonly repoService: RepoService, private readonly tokenManagerService: TokenManagerService) {}

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
  repoFetch(@Query('reponame') reponame, @Param('username') username) {
    // reponame query가 존재할 경우
    if (!!reponame) return this.tokenManagerService.githubApiFetcher(username, this.repoService.repoFetch, reponame);
    // 존재하지 않을 경우 유저의 전체 레포를 뽑아옵니다.
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
  pinnedRepoFetch(@Param('username') username: string) {
    console.log(username);

    return this.tokenManagerService.githubApiFetcher(username, this.repoService.pinnedRepoFetch);
  }
}
