import { Module } from '@nestjs/common';
import { RepoService } from './repo.service';
import { RepoController } from './repo.controller';

@Module({
  controllers: [RepoController],
  providers: [RepoService]
})
export class RepoModule {}
