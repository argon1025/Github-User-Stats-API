import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RepoDto } from './dto/repo.dto';
import { RepoService } from './repo.service';

@Controller('repo')
export class RepoController {
  constructor(private readonly repoService: RepoService) {}

  @Get(':username/pinned-repositories')
  @ApiTags('repositories')
  @ApiOperation({ summary: 'Request pinned Repositories data' })
  @ApiParam({
    name: 'username',
    type: String,
    required: true,
    description: 'Github UserName',
  })
  pinnedRepo(@Param() repoDto: RepoDto) {
    return this.repoService.pinnedRepo(repoDto);
  }
}
