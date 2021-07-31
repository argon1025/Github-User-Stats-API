import { Module } from '@nestjs/common';
import { PinnedRepoService } from './pinned-repo.service';
import { PinnedRepoController } from './pinned-repo.controller';
import { TokenManagerService } from 'src/tokenManager/tokenManager.service';

@Module({
  controllers: [PinnedRepoController],
  providers: [PinnedRepoService, TokenManagerService],
})
export class PinnedRepoModule {}
