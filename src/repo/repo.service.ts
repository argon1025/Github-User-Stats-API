import { HttpException, Injectable } from '@nestjs/common';
import { allRepoResponse } from 'src/common/utils/axios/repo/allRepoResponse';
import { pinnedRepoResponse } from 'src/common/utils/axios/repo/pinnedRepoResponse';
import { repoResponse } from 'src/common/utils/axios/repo/repoResponse';
// import { allRepoResponse, pinnedRepoResponse, repoResponse } from 'src/common/utils/axios';

import testData from './test_data';

@Injectable()
export class RepoService {
  async repoFetch(token, username, reponame) {
    const response = await repoResponse(token, { login: username, repo: reponame });
    const data = response.data.data;
    if (!!response.data.errors) {
      if (response.data.errors[0].type == 'RATE_LIMITED') {
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
    const response = await allRepoResponse(token, { login: username });
    const data = response.data.data;
    if (!!response.data.errors) {
      if (response.data.errors[0].type == 'RATE_LIMITED') {
        throw new HttpException({ code: 'github.RATE_LIMITED', message: '해당토큰의 접근 가능한 횟수가 초과되었습니다.' }, 403);
      }
    }
    if (!data.user && !data.organization) {
      throw new HttpException({ code: 'NOT_FOUND_USER', message: '해당 유저는 존재하지 않습니다.' }, 404);
    }
    return data.user.repositories.nodes;
  }

  async pinnedRepoFetch(token, username) {
    // DB꺼랑 실제 꺼랑 1:1 매칭 후 뿌려주기
    const response = await pinnedRepoResponse(token, { login: username });

    const data = response.data.data;

    if (!!response.data.errors) {
      if (response.data.errors[0].type == 'RATE_LIMITED') {
        throw new HttpException({ code: 'RATE_LIMITED', message: '해당토큰의 접근 가능한 횟수가 초과되었습니다.' }, 403);
      }
    }
    if (data.user == null) {
      throw new HttpException({ code: 'NOTFOUNDUSER', message: '해당 유저는 존재하지 않습니다.' }, 404);
    }
    let pinnedItems = data.user.pinnedItems.nodes;
    pinnedItems.forEach((pinnedItem) => {
      testData.find((element) => (element.node_id == pinnedItem.id ? (pinnedItem['data'] = element.data) : 0));
    });
    return pinnedItems;
  }
}
