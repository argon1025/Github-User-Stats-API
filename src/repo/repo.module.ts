import { Module } from '@nestjs/common';
import { RepoService } from './repo.service';
import { RepoController } from './repo.controller';
import { TokenManagerService } from 'src/tokenManager/tokenManager.service';
import { GithubFetchersService } from 'src/github-fetchers/github-fetchers.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [RepoController],
  providers: [RepoService, TokenManagerService, GithubFetchersService],
})
export class RepoModule {}
