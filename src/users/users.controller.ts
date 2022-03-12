import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':username/events/page/:page')
  @ApiOperation({ summary: 'Request all events data' })
  @ApiParam({
    name: 'username',
    type: 'string',
    required: true,
    description: 'Github UserName',
  })
  @ApiParam({
    name: 'page',
    type: 'string',
    required: true,
    description: 'page',
  })
  allEvents(@Param('username') username: string, @Param('page') page: string) {
    return this.usersService.allEvents(username, page);
  }
}
