import { HttpException, Injectable } from '@nestjs/common';
import { stats_fetcher, totalCommit_fetcher } from 'src/common/utils/stats.axios';
@Injectable()
export class StatsService {
  async statsFetch(token, username) {
    const stats = {
      name: '',
      totalPRs: 0,
      totalCommits: 0,
      totalIssues: 0,
      totalStars: 0,
      contributedTo: 0,
      //   rank: { level: 'C', score: 0 },
    };
    const result = await stats_fetcher(token, { login: username });
    // const test_error = {
    //   error: [
    //     {
    //       type: 'RATE_LIMITED',
    //       message: 'API rate limit exceeded for user ID test',
    //     },
    //   ],
    // };
    if (!!result.data.error) {
      if (result.data.error[0].type == 'RATE_LIMITED') {
        throw new HttpException({ code: 'github.RATE_LIMITED', message: '해당토큰의 접근 가능한 횟수가 초과되었습니다.' }, 400);
      }
    }
    if (result.data.data.user == null) {
      throw new HttpException({ code: 'github.NOTFOUNDUSER', message: '해당 유저는 존재하지 않습니다.' }, 400);
    }
    const user = result.data.data.user;
    stats.name = user.name || user.login;

    stats.totalIssues = user.issues.totalCount;

    stats.totalCommits = user.contributionsCollection.totalCommitContributions;
    stats.totalCommits += await this.totalCommitsFetch(token, username);
    stats.totalCommits += user.contributionsCollection.restrictedContributionsCount;

    stats.totalPRs = user.pullRequests.totalCount;

    stats.contributedTo = user.repositoriesContributedTo.totalCount;

    stats.totalStars = user.repositories.nodes.reduce((prev, curr) => {
      return prev + curr.stargazers.totalCount;
    }, 0);
    return stats;
  }
  async totalCommitsFetch(token, username) {
    //   let res = await retryer(fetchTotalCommits, { login: username });
    const res = await totalCommit_fetcher(token, username);
    if (res.data.total_count) {
      return res.data.total_count;
    }
  }
}
