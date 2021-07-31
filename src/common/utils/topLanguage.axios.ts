import { HttpException } from '@nestjs/common';
import axios from 'axios';

export function toplanguage_fetcher(token, variables) {
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
      throw new HttpException({ code: 'github.UNKOWN', message: error.message }, 400);
    }
  }
}
