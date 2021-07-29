import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { stats_request, total_commit } from 'src/common/utils/axios';
import { Stats } from './dto/stats.dto';
@Injectable()
export class StatsService {
  async fetcher(variables, token) {
    return stats_request(
      {
        Authorization: `bearer ${token}`,
      },
      variables,
    );
  }
  async fetchStats(username: string) {
    const token = process.env.TOKEN;
    if (!username) throw Error('Invalid username');

    const stats: Stats = {
      name: '',
      totalPRs: 0,
      totalCommits: 0,
      totalIssues: 0,
      totalStars: 0,
      contributedTo: 0,
      //   rank: { level: 'C', score: 0 },
    };
    const result = await this.fetcher({ login: username }, token);
    const user = result.data.data.user;
    stats.name = user.name || user.login;
    stats.totalIssues = user.issues.totalCount;
    // normal commits
    stats.totalCommits = user.contributionsCollection.totalCommitContributions;

    // since totalCommitsFetcher already sends totalCommits no need to +=
    stats.totalCommits = await this.totalCommitsFetcher(username);

    // if count_private then add private commits to totalCommits so far.
    stats.totalCommits += user.contributionsCollection.restrictedContributionsCount;

    stats.totalPRs = user.pullRequests.totalCount;
    stats.contributedTo = user.repositoriesContributedTo.totalCount;

    stats.totalStars = user.repositories.nodes.reduce((prev, curr) => {
      return prev + curr.stargazers.totalCount;
    }, 0);

    // 랭크 계산
    // stats.rank = calculateRank({
    //   totalCommits: stats.totalCommits,
    //   totalRepos: user.repositories.totalCount,
    //   followers: user.followers.totalCount,
    //   contributions: stats.contributedTo,
    //   stargazers: stats.totalStars,
    //   prs: stats.totalPRs,
    //   issues: stats.totalIssues,
    // });
    return stats;
  }
  async totalCommitsFetcher(username) {
    const token = process.env.TOKEN;
    // https://developer.github.com/v3/search/#search-commits
    const fetchTotalCommits = (username, token) => {
      return axios({
        method: 'get',
        url: `https://api.github.com/search/commits?q=author:${username}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.cloak-preview',
          Authorization: `bearer ${token}`,
        },
      });
    };

    try {
      //   let res = await retryer(fetchTotalCommits, { login: username });
      const res = await fetchTotalCommits(username, token);
      if (res.data.total_count) {
        return res.data.total_count;
      }
    } catch (err) {
      console.log(err);
      // just return 0 if there is something wrong so that
      // we don't break the whole app
      return 0;
    }
  }
}
