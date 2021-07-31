import { Module } from '@nestjs/common';
import { TopLanguagesService } from './top-languages.service';
import { TopLanguagesController } from './top-languages.controller';

@Module({
  controllers: [TopLanguagesController],
  providers: [TopLanguagesService]
})
export class TopLanguagesModule {}
