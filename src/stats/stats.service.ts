import { Injectable } from '@nestjs/common';
import { GithubFetchersService } from 'src/github-fetchers/github-fetchers.service';

@Injectable()
export class StatsService {
  constructor(private readonly githubFetchersService: GithubFetchersService) {}
  async userStats(username) {
    const stats = {
      name: '',
      totalPRs: 0,
      totalCommits: 0,
      totalIssues: 0,
      totalStars: 0,
      contributedTo: 0,
    };
    const userStatsResponse = await this.githubFetchersService.postRequest({
      query: `
              query userInfo($login: String!) {
                user(login: $login) {
                  name
                  login
                  contributionsCollection {
                    totalCommitContributions
                    restrictedContributionsCount
                  }
                  repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
                    totalCount
                  }
                  pullRequests(first: 1) {
                    totalCount
                  }
                  issues(first: 1) {
                    totalCount
                  }
                  followers {
                    totalCount
                  }
                  repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}) {
                    totalCount
                    nodes {
                      stargazers {
                        totalCount
                      }
                    }
                  }
                }
              }
              `,
      variables: {
        login: username,
      },
    });
    const totalCommentResponse = await this.githubFetchersService.getRequest(`https://api.github.com/search/commits`, {
      q: `author:${username}`,
    });
    const userInfo = userStatsResponse.data.user;
    // name
    stats.name = userInfo.name || userInfo.login;
    //Issues
    stats.totalIssues = userInfo.issues.totalCount;
    // commit
    stats.totalCommits = userInfo.contributionsCollection.totalCommitContributions;
    stats.totalCommits += totalCommentResponse.total_count;
    stats.totalCommits += userInfo.contributionsCollection.restrictedContributionsCount;
    //PR
    stats.totalPRs = userInfo.pullRequests.totalCount;
    //contributedTo
    stats.contributedTo = userInfo.repositoriesContributedTo.totalCount;
    //stars
    stats.totalStars = userInfo.repositories.nodes.reduce((prev, curr) => {
      return prev + curr.stargazers.totalCount;
    }, 0);
    return stats;
  }
  async topLanguage(username) {
    const topLanguageResponse = await this.githubFetchersService.postRequest({
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
      variables: {
        login: username,
      },
    });

    let repoNodes = topLanguageResponse.data.user.repositories.nodes;
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
