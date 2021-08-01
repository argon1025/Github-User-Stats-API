import { HttpException } from '@nestjs/common';
import axios from 'axios';

export async function usersStatsResponse(token, variables) {
  try {
    return await axios({
      url: 'https://api.github.com/graphql',
      method: 'post',
      headers: {
        Authorization: `bearer ${token}`,
      },
      data: {
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
        variables,
      },
    });
  } catch (error) {
    if (error.response) {
      if (error.response.status == 401) {
        throw new HttpException({ code: 'BAD_CREDENTIALS', message: `${token} - 토큰은 만료가 되었거나, 사용할 수 없는 토큰입니다.` }, 401);
      }
      throw new HttpException({ code: 'UNKOWN', message: error.message }, 400);
    }
  }
}
