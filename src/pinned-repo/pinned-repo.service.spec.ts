import { Test, TestingModule } from '@nestjs/testing';
import { PinnedRepoService } from './pinned-repo.service';

describe('PinnedRepoService', () => {
  let service: PinnedRepoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PinnedRepoService],
    }).compile();

    service = module.get<PinnedRepoService>(PinnedRepoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
