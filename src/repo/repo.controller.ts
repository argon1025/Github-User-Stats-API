import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TokenManagerService } from 'src/tokenManager/tokenManager.service';
import { RepoService } from './repo.service';

@Controller('repo')
export class RepoController {
  constructor(private readonly repoService: RepoService, private readonly tokenManagerService: TokenManagerService) {}

  @Get(':reponame/user/:username')
  repoFetch(@Param('reponame') reponame, @Param('username') username) {
    return this.tokenManagerService.githubApiFetcher(username, this.repoService.repoFetch, reponame);
  }

  @Get(':username')
  allrepoFetch(@Param('reponame') reponame, @Param('username') username) {
    return this.tokenManagerService.githubApiFetcher(username, this.repoService.allrepoFetch);
  }
}
