import { HttpException } from '@nestjs/common';
import axios from 'axios';

export async function weekyStatsResponse(token, username, page) {
  try {
    return await axios({
      method: 'get',
      url: `https://api.github.com/users/${username}/events`,
      params: {
        page: page,
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.cloak-preview',
        Authorization: `bearer ${token}`,
      },
    });
  } catch (error) {
    if (error.response) {
      if (error.response.status == 403) {
        throw new HttpException({ code: 'SHORT_RATE_LIMITED', message: '깃허브에서 일시적으로 접근을 막았습니다. 재시도 해주세요.' }, 401);
      }
      if (error.response.status == 401) {
        throw new HttpException({ code: 'BAD_CREDENTIALS', message: `${token} - 토큰은 만료가 되었거나, 사용할 수 없는 토큰입니다.` }, 401);
      }
      throw new HttpException({ code: 'UNKOWN', message: error.message }, 400);
    }
  }
}
