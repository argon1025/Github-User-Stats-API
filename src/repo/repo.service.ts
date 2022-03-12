import { HttpException, Injectable } from '@nestjs/common';
import { pinnedRepoResponse } from 'src/common/utils/axios/repo/pinnedRepoResponse';
import { GithubFetchersService } from 'src/github-fetchers/github-fetchers.service';

@Injectable()
export class RepoService {
  constructor(private readonly githubFetchersService: GithubFetchersService) {}
  async repo(username, reponame) {
    const response = await this.githubFetchersService.postRequest({
      query: `
      fragment RepoInfo on Repository {
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
      query getRepo($login: String!, $repo: String!) {
        user(login: $login) {
          repository(name: $repo) {
            ...RepoInfo
          }
        }
        organization(login: $login) {
          repository(name: $repo) {
            ...RepoInfo
          }
        }
      }
    `,
      variables: {
        login: username,
        repo: reponame,
      },
    });
    const data = response.data;
    const isUser = data.organization === null && data.user;
    const isOrg = data.user === null && data.organization;

    if (isUser) {
      if (!data.user.repository || data.user.repository.isPrivate) {
        throw new HttpException({ code: 'NOT_FOUND_USER_REPO', message: '레포지토리가 존재하지 않습니다.' }, 404);
      }
      return data.user.repository;
    }

    if (isOrg) {
      if (!data.organization.repository || data.organization.repository.isPrivate) {
        throw new HttpException({ code: 'NOT_FOUND_USER_REPO', message: '레포지토리가 존재하지 않습니다.' }, 404);
      }
      return data.organization.repository;
    }
  }

  async allRepos(username) {
    const allReposResponse = await this.githubFetchersService.postRequest({
      query: `
      fragment RepoInfo on Repository {
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
    query getRepo($login: String!){
        user(login: $login) {
            repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}) {
                nodes{
                    ... on Repository{
                        ...RepoInfo
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
    const data = allReposResponse.data;
    return data.user.repositories.nodes;
  }

  async pinnedRepo(username) {
    // DB꺼랑 실제 꺼랑 1:1 매칭 후 뿌려주기
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
