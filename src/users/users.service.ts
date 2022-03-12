import { Injectable } from '@nestjs/common';
import { GithubFetchersService } from 'src/github-fetchers/github-fetchers.service';
@Injectable()
export class UsersService {
  constructor(private readonly githubFetchersService: GithubFetchersService) {}
  async allEvents(username, page) {
    const allEventsResponse = await this.githubFetchersService.getRequest(`https://api.github.com/users/${username}/events`, {
      page: page,
    });
    return allEventsResponse.data;
  }
}
