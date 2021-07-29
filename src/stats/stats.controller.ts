import { Controller, Get, Param } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
  @Get(':username')
  statsFecher(@Param('username') username: string) {
    return this.statsService.statsFetch(process.env.TOKEN, username);
  }
}
