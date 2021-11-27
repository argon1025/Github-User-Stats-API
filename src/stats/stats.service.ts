import { HttpException, Injectable } from '@nestjs/common';
import { toplanguageResponse } from 'src/common/utils/axios/stats/toplanguageResponse';
import { totalCommitResponse } from 'src/common/utils/axios/stats/totalCommitResponse';
import { usersStatsResponse } from 'src/common/utils/axios/stats/usersStatsResponse';

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
    };
    const response = await usersStatsResponse(token, { login: username });
    // const test_error = {
    //   errors: [
    //     {
    //       type: 'RATE_LIMITED',
    //       message: 'API rate limit exceeded for user ID test',
    //     },
    //   ],
    // };
    const data = response.data.data;
    if (!!response.data.errors) {
      if (response.data.errors[0].type == 'RATE_LIMITED') {
        throw new HttpException({ code: 'RATE_LIMITED', message: '해당토큰의 접근 가능한 횟수가 초과되었습니다.' }, 403);
      }
    }
    if (data.user == null) {
      throw new HttpException({ code: 'NOT_FOUND_USER', message: '해당 유저는 존재하지 않습니다.' }, 404);
    }
    const user = data.user;
    stats.name = user.name || user.login;

    stats.totalIssues = user.issues.totalCount;

    stats.totalCommits = user.contributionsCollection.totalCommitContributions;
    const res = await totalCommitResponse(token, username);

    stats.totalCommits += res.data.total_count;
    stats.totalCommits += user.contributionsCollection.restrictedContributionsCount;

    stats.totalPRs = user.pullRequests.totalCount;

    stats.contributedTo = user.repositoriesContributedTo.totalCount;

    stats.totalStars = user.repositories.nodes.reduce((prev, curr) => {
      return prev + curr.stargazers.totalCount;
    }, 0);
    return stats;
  }
  async topLanguageFetch(token, username) {
    const response = await toplanguageResponse(token, { login: username });
    const data = response.data.data;
    if (!!response.data.errors) {
      if (response.data.errors[0].type == 'RATE_LIMITED') {
        throw new HttpException({ code: 'RATE_LIMITED', message: '해당토큰의 접근 가능한 횟수가 초과되었습니다.' }, 403);
      }
    }
    if (data.user == null) {
      throw new HttpException({ code: 'NOTFOUNDUSER', message: '해당 유저는 존재하지 않습니다.' }, 404);
    }
    let repoNodes = data.user.repositories.nodes;
    let totalSize = 0;
    let repoToHide = {};
    // filter out repositories to be hidden
    repoNodes = repoNodes
      .sort((a, b) => b.size - a.size)
      .filter((name) => {
        return !repoToHide[name.name];
      });

    repoNodes = repoNodes
      .filter((node) => {
        return node.languages.edges.length > 0;
      })
      .reduce((acc, curr) => curr.languages.edges.concat(acc), [])
      .reduce((acc, prev) => {
        let langSize = prev.size;
        if (acc[prev.node.name] && prev.node.name === acc[prev.node.name].name) {
          langSize = prev.size + acc[prev.node.name].size;
        }
        return {
          ...acc,
          [prev.node.name]: {
            name: prev.node.name,
            color: prev.node.color,
            size: langSize,
          },
        };
      }, {});

    let topLangs = Object.keys(repoNodes)
      .sort((a, b) => repoNodes[b].size - repoNodes[a].size)
      .slice(0, 5)
      .reduce((result, key) => {
        result[key] = repoNodes[key];
        return result;
      }, {});

    return topLangs;
  }
}
