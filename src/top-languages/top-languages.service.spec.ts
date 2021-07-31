import { Test, TestingModule } from '@nestjs/testing';
import { TopLanguagesService } from './top-languages.service';

describe('TopLanguagesService', () => {
  let service: TopLanguagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopLanguagesService],
    }).compile();

    service = module.get<TopLanguagesService>(TopLanguagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
