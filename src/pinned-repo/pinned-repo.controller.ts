import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TokenManagerService } from 'src/tokenManager/tokenManager.service';
import { PinnedRepoService } from './pinned-repo.service';

@Controller('pinned-repo')
export class PinnedRepoController {
  constructor(private readonly pinnedRepoService: PinnedRepoService, private readonly tokenManagerService: TokenManagerService) {}
  @Get(':username')
  PinnedRepoFetch(@Param('username') username: string) {
    return this.tokenManagerService.githubApiFetcher(username, this.pinnedRepoService.PinnedRepoFetch);
  }
}
