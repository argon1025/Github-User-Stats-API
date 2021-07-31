import { Module } from '@nestjs/common';
import { TokenManagerService } from './tokenManager.service';

@Module({
  providers: [TokenManagerService],
})
export class TokenManagerModule {}
