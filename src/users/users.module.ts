import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TokenManagerService } from 'src/tokenManager/tokenManager.service';
import { GithubFetchersService } from 'src/github-fetchers/github-fetchers.service';

@Module({
  imports: [HttpModule],
  controllers: [UsersController],
  providers: [UsersService, TokenManagerService, GithubFetchersService],
})
export class UsersModule {}
