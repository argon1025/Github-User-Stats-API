import { HttpException } from '@nestjs/common';
import axios from 'axios';

export function stats_fetcher(token, variables) {
  try {
    return axios({
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
    // 200으로 출력되는 에러
    if (error.response) {
      throw new HttpException({ code: 'github.UNKOWN', message: error.message }, 400);
    }
  }
}
export async function totalCommit_fetcher(token, username) {
  try {
    return await axios({
      method: 'get',
      url: `https://api.github.com/search/commits?q=author:${username}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.cloak-preview',
        Authorization: `bearer ${token}`,
      },
    });
  } catch (error) {
    if (error.response) {
      if (error.response.status == 403) {
        throw new HttpException({ code: 'github.SHORT_RATE_LIMITED', message: '깃허브에서 일시적으로 접근을 막았습니다. 재시도 해주세요.' }, 403);
      }
      throw new HttpException({ code: 'github.UNKOWN', message: error.message }, 400);
    }
  }
}
