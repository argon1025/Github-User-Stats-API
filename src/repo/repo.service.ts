import { HttpException, Injectable } from '@nestjs/common';
import { repo_fetcher } from 'src/common/utils/repo.axios';

@Injectable()
export class RepoService {
  async repoFetch(token, reponame, username) {
    const result = await repo_fetcher(token, { login: username, repo: reponame });
    const data = result.data.data;
    console.log(result.data.errors);
    if (!!result.data.errors) {
      if (result.data.errors[0].type == 'RATE_LIMITED') {
        throw new HttpException({ code: 'github.RATE_LIMITED', message: '해당토큰의 접근 가능한 횟수가 초과되었습니다.' }, 400);
      }
    }
    if (!data.user && !data.organization) {
      throw new HttpException({ code: 'github.NOTFOUNDUSER', message: '해당 유저는 존재하지 않습니다.' }, 400);
    }
    const isUser = data.organization === null && data.user;
    const isOrg = data.user === null && data.organization;

    if (isUser) {
      if (!data.user.repository || data.user.repository.isPrivate) {
        throw new HttpException({ code: 'github.NOTFOUNDUSERREPO', message: '레포지토리가 존재하지 않습니다.' }, 400);
      }
      return data.user.repository;
    }

    if (isOrg) {
      if (!data.organization.repository || data.organization.repository.isPrivate) {
        throw new HttpException({ code: 'github.NOTFOUNDUSERREPO', message: '레포지토리가 존재하지 않습니다.' }, 400);
      }
      return data.organization.repository;
    }
  }
}
