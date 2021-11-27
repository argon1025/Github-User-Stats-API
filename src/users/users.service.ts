import { HttpException, Injectable } from '@nestjs/common';
import { allEventsResponse } from 'src/common/utils/axios/events/allEventsResponse';
import { weekyStatsResponse } from 'src/common/utils/axios/events/weekyStatsResponse';
@Injectable()
export class UsersService {
  async allEvents(token, username, page) {
    const { data } = await allEventsResponse(token, username, page);

    if (!!data.errors) {
      if (data.errors[0].type == 'RATE_LIMITED') {
        throw new HttpException({ code: 'RATE_LIMITED', message: '해당토큰의 접근 가능한 횟수가 초과되었습니다.' }, 403);
      }
    }
    return data;
  }
  async weeklyStats(token, username) {
    const responseData = {
      PRCount: 0,
      IssueCount: 0,
      commitCount: 0,
    };
    let page = 1;
    let condition = true;
    const now = new Date().getTime();

    while (condition) {
      console.log(page);
      const { data } = await weekyStatsResponse(token, username, page);
      // 1. 7일 후인거 빼고 리턴
      // 2. commit, PR, issue
      for (let i = 0; i < data.length; i++) {
        console.log(data[i].created_at);
        const dDay = (now - new Date(data[i].created_at).getTime()) / (1000 * 60 * 60 * 24);
        if (dDay < 7) {
          if (data[i].type === 'IssuesEvent' && 'IssueCommentEvent') {
            responseData.IssueCount += 1;
          }
          if (data[i].type === 'PullRequestEvent') {
            responseData.PRCount += 1;
            responseData.commitCount += data[i].payload.pull_request.commits;
          }
          responseData.commitCount += !data[i].payload.commits ? 0 : data[i].payload.commits.length;
        } else {
          condition = false;
          break;
        }
      }
      page++;
    }
    return responseData;
  }
}
