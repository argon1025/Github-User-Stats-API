import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CacheManagerService } from 'src/cache-manager/cache-manager.service';
import { PinnedRepo, RepoDto } from './dto/repo.dto';
import { RepoService } from './repo.service';

@Controller('repo')
export class RepoController {
  constructor(private readonly cacheManagerService: CacheManagerService, private readonly repoService: RepoService) {}
  @Get(':username/pinned-repositories')
  @ApiTags('repositories')
  @ApiOperation({ summary: 'Request pinned Repositories data' })
  @ApiParam({
    name: 'username',
    type: String,
    required: true,
    description: 'Github UserName',
  })
  async pinnedRepo(@Param() repoDto: RepoDto): Promise<PinnedRepo[]> {
    const cacheResponse = await this.cacheManagerService.getPinnedRepo(repoDto.username);
    if (cacheResponse) return cacheResponse;
    const githubResponse = await this.repoService.pinnedRepo(repoDto);
    console.log(githubResponse);
    await this.cacheManagerService.setPinnedRepo(repoDto.username, githubResponse);
    return githubResponse;
  }
}
