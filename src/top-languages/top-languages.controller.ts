import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TokenManagerService } from 'src/tokenManager/tokenManager.service';
import { TopLanguagesService } from './top-languages.service';

@Controller('top-lang')
export class TopLanguagesController {
  constructor(private readonly topLanguagesService: TopLanguagesService, private readonly tokenManagerService: TokenManagerService) {}

  @Get(':username')
  topLanguageFetch(@Param('username') username: string) {
    return this.tokenManagerService.githubApiFetcher(username, this.topLanguagesService.topLanguageFetch);
  }
}
