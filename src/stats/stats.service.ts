import { HttpException, Injectable } from '@nestjs/common';
import { stats_fetcher, totalCommit_fetcher } from 'src/common/utils/axios';
@Injectable()
export class StatsService {
  async statsFetch(token, username) {
    if (!username) throw new HttpException({ code: 'stats.statsFetch.NOTFOUNDUSER', message: '유저를 찾을 수 없습니다.' }, 404);

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
    try {
      //   let res = await retryer(fetchTotalCommits, { login: username });
      const res = await totalCommit_fetcher(token, username);
      if (res.data.total_count) {
        return res.data.total_count;
      }
    } catch (err) {
      throw new HttpException({ code: 'stats.totlaCommitsFetch.NOTFOUND', message: '알수없는 에러' }, 404);
    }
  }
}
