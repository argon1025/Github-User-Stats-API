import { Module } from '@nestjs/common';
import { RepoService } from './repo.service';
import { RepoController } from './repo.controller';
import { TokenManagerService } from 'src/tokenManager/tokenManager.service';

@Module({
  controllers: [RepoController],
  providers: [RepoService, TokenManagerService],
})
export class RepoModule {}
