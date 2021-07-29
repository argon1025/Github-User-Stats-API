import axios from 'axios';

export function stats_fetcher(token, variables) {
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
}
export function totalCommit_fetcher(token, username) {
  return axios({
    method: 'get',
    url: `https://api.github.com/search/commits?q=author:${username}`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.cloak-preview',
      Authorization: `bearer ${token}`,
    },
  });
}
