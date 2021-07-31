import { Test, TestingModule } from '@nestjs/testing';
import { PinnedRepoController } from './pinned-repo.controller';
import { PinnedRepoService } from './pinned-repo.service';

describe('PinnedRepoController', () => {
  let controller: PinnedRepoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PinnedRepoController],
      providers: [PinnedRepoService],
    }).compile();

    controller = module.get<PinnedRepoController>(PinnedRepoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
