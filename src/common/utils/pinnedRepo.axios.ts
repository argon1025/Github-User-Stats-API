import { HttpException } from '@nestjs/common';
import axios from 'axios';

export function pinnedRepo_fetcher(token, variables) {
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
        variables,
      },
    });
  } catch (error) {
    if (error.response) {
      throw new HttpException({ code: 'github.UNKOWN', message: error.message }, 400);
    }
  }
}
