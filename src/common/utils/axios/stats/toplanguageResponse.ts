import { HttpException } from '@nestjs/common';
import axios from 'axios';

export async function toplanguageResponse(token, variables) {
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
            # fetch only owner repos & not forks
            repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
              nodes {
                name
                languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                  edges {
                    size
                    node {
                      color
                      name
                    }
                  }
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
