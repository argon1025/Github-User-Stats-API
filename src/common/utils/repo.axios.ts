import { HttpException } from '@nestjs/common';
import axios from 'axios';

export function repo_fetcher(token, variables) {
  try {
    return axios({
      url: 'https://api.github.com/graphql',
      method: 'post',
      headers: {
        Authorization: `bearer ${token}`,
      },
      data: {
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
        variables,
      },
    });
  } catch (error) {
    if (error.response) {
      throw new HttpException({ code: 'github.UNKOWN', message: error.message }, 400);
    }
  }
}

export function all_repo_fetcher(token, variables) {
  try {
    return axios({
      url: 'https://api.github.com/graphql',
      method: 'post',
      headers: {
        Authorization: `bearer ${token}`,
      },
      data: {
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
        variables,
      },
    });
  } catch (error) {
    if (error.response) {
      throw new HttpException({ code: 'github.UNKOWN', message: error.message }, 400);
    }
  }
}
