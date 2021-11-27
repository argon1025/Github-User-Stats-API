import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TokenManagerService } from 'src/tokenManager/tokenManager.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, TokenManagerService],
})
export class UsersModule {}
