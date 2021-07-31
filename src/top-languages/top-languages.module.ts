import { Module } from '@nestjs/common';
import { TopLanguagesService } from './top-languages.service';
import { TopLanguagesController } from './top-languages.controller';
import { TokenManagerService } from 'src/tokenManager/tokenManager.service';

@Module({
  controllers: [TopLanguagesController],
  providers: [TopLanguagesService, TokenManagerService],
})
export class TopLanguagesModule {}
