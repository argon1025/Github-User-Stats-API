import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RepoService } from './repo.service';

@Controller('repo')
export class RepoController {
  constructor(private readonly repoService: RepoService) {}

  @Get(':reponame/user/:username')
  repoFetch(@Param('reponame') reponame, @Param('username') username) {
    return this.repoService.repoFetch(process.env.TOKEN, reponame, username);
  }
}
