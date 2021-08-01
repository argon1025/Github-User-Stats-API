import { HttpException, Injectable } from '@nestjs/common';
import { all_repo_fetcher, repo_fetcher } from 'src/Common/utils/repo.axios';
import { pinnedRepo_fetcher } from 'src/Common/utils/pinnedRepo.axios';
import testData from './test_data';

@Injectable()
export class RepoService {
  async repoFetch(token, username, reponame) {
    const result = await repo_fetcher(token, { login: username, repo: reponame });
    const data = result.data.data;
    console.log(result.data.errors);
    if (!!result.data.errors) {
      if (result.data.errors[0].type == 'RATE_LIMITED') {
        throw new HttpException({ code: 'RATE_LIMITED', message: '해당토큰의 접근 가능한 횟수가 초과되었습니다.' }, 403);
      }
    }
    if (!data.user && !data.organization) {
      throw new HttpException({ code: 'NOT_FOUND_USER', message: '해당 유저는 존재하지 않습니다.' }, 404);
    }
    const isUser = data.organization === null && data.user;
    const isOrg = data.user === null && data.organization;

    if (isUser) {
      if (!data.user.repository || data.user.repository.isPrivate) {
        throw new HttpException({ code: 'NOT_FOUND_USER_REPO', message: '레포지토리가 존재하지 않습니다.' }, 404);
      }
      return data.user.repository;
    }

    if (isOrg) {
      if (!data.organization.repository || data.organization.repository.isPrivate) {
        throw new HttpException({ code: 'NOT_FOUND_USER_REPO', message: '레포지토리가 존재하지 않습니다.' }, 404);
      }
      return data.organization.repository;
    }
  }

  async allrepoFetch(token, username) {
    const result = await all_repo_fetcher(token, { login: username });
    const data = result.data.data;
    if (!!result.data.errors) {
      if (result.data.errors[0].type == 'RATE_LIMITED') {
        throw new HttpException({ code: 'github.RATE_LIMITED', message: '해당토큰의 접근 가능한 횟수가 초과되었습니다.' }, 403);
      }
    }
    if (!data.user && !data.organization) {
      throw new HttpException({ code: 'NOT_FOUND_USER', message: '해당 유저는 존재하지 않습니다.' }, 404);
    }
    return data.user.repositories.nodes;
  }

  async PinnedRepoFetch(token, username) {
    // DB꺼랑 실제 꺼랑 1:1 매칭 후 뿌려주기
    const result = await pinnedRepo_fetcher(token, { login: username });
    if (!!result.data.errors) {
      if (result.data.errors[0].type == 'RATE_LIMITED') {
        throw new HttpException({ code: 'RATE_LIMITED', message: '해당토큰의 접근 가능한 횟수가 초과되었습니다.' }, 403);
      }
    }
    if (result.data.data.user == null) {
      throw new HttpException({ code: 'NOTFOUNDUSER', message: '해당 유저는 존재하지 않습니다.' }, 404);
    }
    let pinnedItems = result.data.data.user.pinnedItems.nodes;
    pinnedItems.forEach((pinnedItem) => {
      testData.find((element) => (element.node_id == pinnedItem.id ? (pinnedItem['data'] = element.data) : 0));
    });
    return pinnedItems;
  }
}
