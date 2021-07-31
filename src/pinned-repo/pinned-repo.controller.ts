import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PinnedRepoService } from './pinned-repo.service';

@Controller('pinned-repo')
export class PinnedRepoController {
  constructor(private readonly pinnedRepoService: PinnedRepoService) {}
  @Get(':username')
  PinnedRepoFetch(@Param('username') username: string) {
    return this.pinnedRepoService.PinnedRepoFetch(process.env.TOKEN, username);
  }
}
