import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class GithubFetchersService {
  constructor(private readonly httpService: HttpService) {}
  UsersStatsFetcher = async (token, username) => {
    return lastValueFrom(
      this.httpService
        .post(
          'https://api.github.com/graphql',
          {
            query: `
                  query userInfo($login: String!) {
                    user(login: $login) {
                      name
                      login
                      contributionsCollection {
                        totalCommitContributions
                        restrictedContributionsCount
                      }
                      repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
                        totalCount
                      }
                      pullRequests(first: 1) {
                        totalCount
                      }
                      issues(first: 1) {
                        totalCount
                      }
                      followers {
                        totalCount
                      }
                      repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}) {
                        totalCount
                        nodes {
                          stargazers {
                            totalCount
                          }
                        }
                      }
                    }
                  }
                  `,
            variables: {
              login: username,
            },
          },
          {
            headers: {
              Authorization: `bearer ${token}`,
            },
          },
        )
        .pipe(map((res) => res.data)),
    );
  };
}
