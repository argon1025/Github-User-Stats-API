import { Module } from '@nestjs/common';
import { PinnedRepoService } from './pinned-repo.service';
import { PinnedRepoController } from './pinned-repo.controller';

@Module({
  controllers: [PinnedRepoController],
  providers: [PinnedRepoService]
})
export class PinnedRepoModule {}
