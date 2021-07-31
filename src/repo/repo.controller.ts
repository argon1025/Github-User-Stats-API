import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RepoService } from './repo.service';

@Controller('repo')
export class RepoController {
  constructor(private readonly repoService: RepoService) {}

  @Get(':reponame/user/:username')
  repoFetch(@Param('reponame') reponame, @Param('username') username) {
    console.log('1');

    return this.repoService.repoFetch(process.env.TOKEN, reponame, username);
  }

  @Get(':username')
  allrepoFetch(@Param('reponame') reponame, @Param('username') username) {
    console.log('2');

    return this.repoService.allrepoFetch(process.env.TOKEN, username);
  }
}
