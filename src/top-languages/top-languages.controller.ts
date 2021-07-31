import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TopLanguagesService } from './top-languages.service';

@Controller('top-lang')
export class TopLanguagesController {
  constructor(private readonly topLanguagesService: TopLanguagesService) {}

  @Get(':username')
  topLanguageFetch(@Param('username') username: string) {
    return this.topLanguagesService.topLanguageFetch(process.env.TOKEN, username);
  }
}
