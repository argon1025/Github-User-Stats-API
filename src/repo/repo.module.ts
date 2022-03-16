import { Module } from '@nestjs/common';
import { RepoService } from './repo.service';
import { RepoController } from './repo.controller';
import { HttpModule } from '@nestjs/axios';
import { CacheManagerModule } from 'src/cache-manager/cache-manager.module';
import { GithubFetchersModule } from 'src/github-fetchers/github-fetchers.module';

@Module({
  imports: [HttpModule, CacheManagerModule, GithubFetchersModule],
  controllers: [RepoController],
  providers: [RepoService],
})
export class RepoModule {}
