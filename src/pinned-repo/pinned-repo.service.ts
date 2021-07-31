import { HttpException, Injectable } from '@nestjs/common';
import { pinnedRepo_fetcher } from 'src/common/utils/pinnedRepo.axios';
import testData from './test_data';
@Injectable()
export class PinnedRepoService {
  async PinnedRepoFetch(token, username) {
    // DB꺼랑 실제 꺼랑 1:1 매칭 후 뿌려주기
    const result = await pinnedRepo_fetcher(token, { login: username });
    if (!!result.data.errors) {
      if (result.data.errors[0].type == 'RATE_LIMITED') {
        throw new HttpException({ code: 'github.RATE_LIMITED', message: '해당토큰의 접근 가능한 횟수가 초과되었습니다.' }, 400);
      }
    }
    if (result.data.data.user == null) {
      throw new HttpException({ code: 'github.NOTFOUNDUSER', message: '해당 유저는 존재하지 않습니다.' }, 400);
    }
    let pinnedItems = result.data.data.user.pinnedItems.nodes;
    pinnedItems.forEach((pinnedItem) => {
      testData.find((element) => (element.node_id == pinnedItem.id ? (pinnedItem['data'] = element.data) : 0));
    });
    return pinnedItems;
  }
}
