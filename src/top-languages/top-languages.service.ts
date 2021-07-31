import { HttpException, Injectable } from '@nestjs/common';
import { toplanguage_fetcher } from 'src/common/utils/topLanguage.axios';
@Injectable()
export class TopLanguagesService {
  async topLanguageFetch(token, username) {
    const result = await toplanguage_fetcher(token, { login: username });
    if (!!result.data.error) {
      if (result.data.error[0].type == 'RATE_LIMITED') {
        throw new HttpException({ code: 'github.RATE_LIMITED', message: '해당토큰의 접근 가능한 횟수가 초과되었습니다.' }, 400);
      }
    }
    if (result.data.data.user == null) {
      throw new HttpException({ code: 'github.NOTFOUNDUSER', message: '해당 유저는 존재하지 않습니다.' }, 400);
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
