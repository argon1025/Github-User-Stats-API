import { HttpException, Injectable } from '@nestjs/common';
import { GithubFetchersService } from 'src/github-fetchers/github-fetchers.service';
import { RepoDto } from './dto/repo.dto';
import { Repo } from './interface/repo.interface';

@Injectable()
export class RepoService {
  constructor(private readonly githubFetchersService: GithubFetchersService) {}

  async pinnedRepo(repoDto: RepoDto): Promise<Repo[]> {
    const { username } = repoDto;
    const pinnedRepoResponse = await this.githubFetchersService.postRequest({
      query: `
      fragment RepoInfo on Repository {
          id
          name
          nameWithOwner
          isPrivate
          isArchived
          isTemplate
          stargazers {
              totalCount
          }
          description
          primaryLanguage {
              color
              id
              name
          }
          forkCount
      }
      
      query PinnedRepo($login: String!) {
          user(login: $login){
              pinnedItems(first: 6, types: REPOSITORY){
                  nodes {
                      ... on Repository {
                          ... RepoInfo
                      }
                  }
              }
          }
      }
      `,
      variables: {
        login: username,
      },
    });
    let pinnedItems = pinnedRepoResponse.data.user.pinnedItems.nodes;
    return pinnedItems;
  }
}
