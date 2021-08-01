import { HttpException } from '@nestjs/common';
import axios from 'axios';

export async function pinnedRepoResponse(token, variables) {
  try {
    return await axios({
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
      if (error.response.status == 401) {
        throw new HttpException({ code: 'BAD_CREDENTIALS', message: `${token} - 토큰은 만료가 되었거나, 사용할 수 없는 토큰입니다.` }, 401);
      }
      throw new HttpException({ code: 'UNKOWN', message: error.message }, 400);
    }
  }
}
