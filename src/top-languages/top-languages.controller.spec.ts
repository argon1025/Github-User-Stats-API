import { Test, TestingModule } from '@nestjs/testing';
import { TopLanguagesController } from './top-languages.controller';
import { TopLanguagesService } from './top-languages.service';

describe('TopLanguagesController', () => {
  let controller: TopLanguagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopLanguagesController],
      providers: [TopLanguagesService],
    }).compile();

    controller = module.get<TopLanguagesController>(TopLanguagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
