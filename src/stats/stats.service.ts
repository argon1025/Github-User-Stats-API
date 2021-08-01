import { HttpException, Injectable } from '@nestjs/common';
import { stats_fetcher, totalCommit_fetcher } from 'src/Common/utils/stats.axios';
import { toplanguage_fetcher } from 'src/Common/utils/topLanguage.axios';

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
    //   errors: [
    //     {
    //       type: 'RATE_LIMITED',
    //       message: 'API rate limit exceeded for user ID test',
    //     },
    //   ],
    // };
    if (!!result.data.errors) {
      if (result.data.errors[0].type == 'RATE_LIMITED') {
        throw new HttpException({ code: 'RATE_LIMITED', message: '해당토큰의 접근 가능한 횟수가 초과되었습니다.' }, 403);
      }
    }
    if (result.data.data.user == null) {
      throw new HttpException({ code: 'NOT_FOUND_USER', message: '해당 유저는 존재하지 않습니다.' }, 404);
    }
    const user = result.data.data.user;
    stats.name = user.name || user.login;

    stats.totalIssues = user.issues.totalCount;

    stats.totalCommits = user.contributionsCollection.totalCommitContributions;
    const res = await totalCommit_fetcher(token, username);

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
    const result = await toplanguage_fetcher(token, { login: username });
    if (!!result.data.errors) {
      if (result.data.errors[0].type == 'RATE_LIMITED') {
        throw new HttpException({ code: 'RATE_LIMITED', message: '해당토큰의 접근 가능한 횟수가 초과되었습니다.' }, 403);
      }
    }
    if (result.data.data.user == null) {
      throw new HttpException({ code: 'NOTFOUNDUSER', message: '해당 유저는 존재하지 않습니다.' }, 404);
    }
    let repoNodes = result.data.data.user.repositories.nodes;
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
      // flatten the list of language nodes
      .reduce((acc, curr) => curr.languages.edges.concat(acc), [])
      .reduce((acc, prev) => {
        // get the size of the language (bytes)
        let langSize = prev.size;

        // if we already have the language in the accumulator
        // & the current language name is same as previous name
        // add the size to the language size.
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

    const topLangs = Object.keys(repoNodes)
      .sort((a, b) => repoNodes[b].size - repoNodes[a].size)
      .reduce((result, key) => {
        result[key] = repoNodes[key];
        return result;
      }, {});

    return topLangs;
  }
}
