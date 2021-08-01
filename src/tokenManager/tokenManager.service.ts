import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenManagerService {
  private tokenListScope: number;
  private tokenList: string[] = [];
  private tokenEnvValName: string = 'GITHUB_TOKEN_';
  constructor(private configService: ConfigService) {
    this.LoadTokenDataFromEnv();
  }

  // 토큰 데이터가 존재하는지 유무
  tokenDataExistAtEnv(checkNumber: number = 1): boolean {
    Logger.log(`check tokenData At Env..`, 'tokenDataExistAtEnv');
    const tokenData = this.configService.get<string>(`${this.tokenEnvValName}${checkNumber}`, null);

    if (!!tokenData) {
      // 토큰 데이터가 존재할 경우
      return true;
    } else {
      // 토큰 데이터가 존재하지 않을경우
      return false;
    }
  }
  // ENV 에서 토큰을 로드하는 함수
  LoadTokenDataFromEnv(): boolean {
    if (!this.tokenDataExistAtEnv()) {
      Logger.error('Token data does not exist in Env.');
      return false;
    }
    let tokenData: string;
    let envLoadCount: number = 1;
    while (true) {
      // 토큰 데이터를 로드
      tokenData = this.configService.get<string>(`${this.tokenEnvValName}${envLoadCount}`, null);
      // 토큰 데이터를 로드 했는지 체크
      // 토큰 데이터가 있을경우 배열에 푸쉬하고 envLoadCount +1 한다
      if (!!tokenData) {
        Logger.log(`${tokenData} has Loaded`, 'LoadTokenDataFromEnv');
        this.tokenList.push(tokenData);
        envLoadCount++;
      } else {
        // 토큰 데이터가 없을경우 마친다
        Logger.log(`Token Load Ended`, 'LoadTokenDataFromEnv');
        break;
      }
    }
    // 배열길이를 체크해 1이상일 경우 초기 토큰 스코프를 설정하고 boolean을 리턴한다
    if (this.tokenList.length >= 1) {
      this.setTokenScope(0);
      return true;
    } else {
      return false;
    }
  }
  // 토큰 스코프를 설정하는 함수
  setTokenScope(tokenListNumber: number = 0) {
    Logger.log(`change tokenListScope to ${tokenListNumber}`, 'setTokenScope');
    this.tokenListScope = tokenListNumber;
  }
  getTokenScope(): number {
    return this.tokenListScope;
  }

  // 현재 스코프된 토큰을 반환하는 함수
  getToken(): string {
    return this.tokenList[this.tokenListScope];
  }

  // 토큰 만료를 알리고 다른 토큰으로 변경요청을 받는 함수
  changeToken() {
    //토큰이 저장된 배열의 길이를 구한다
    const tokenListLength = this.tokenList.length - 1;

    // 토큰 리스트에 데이터가 없을 경우
    if (tokenListLength <= -1) {
      Logger.error('Token data does not exist in Env, stop changeToken');
      return false;
    }
    // 토큰 리스트에 데이터가 하나밖에 없을경우
    if (tokenListLength <= 0) {
      Logger.error('There is only one token data, stop changeToken');
      return false;
    }

    // 토큰 리스트를 변경할 수 있을경우 경우에 따라 다르게 변경한다
    if (tokenListLength === this.tokenListScope) {
      //토큰 스코프를 초기화 한다
      this.setTokenScope(0);
      Logger.log(`TokenScope is Change -> ${this.getTokenScope()}`, 'CHANGE_TOKEN');
      return true;
    } else {
      // 토큰스코프를 +1 증가시킨다
      this.setTokenScope(this.getTokenScope() + 1);
      Logger.log(`TokenScope is Change+ -> ${this.getTokenScope()}`, 'CHANGE_TOKEN');
      return true;
    }
  }

  async githubApiFetcher(username: string, fetcher: any, option?: any) {
    // 유저 이름이 올바르지 않을 경우
    if (!username) {
      throw new HttpException({ code: 'tokenManager.githubApiFetcher.InvalidUsername', message: '올바르지 않은 유저이름 입니다' }, 401);
    }
    let retryCount: number = 1;
    // 전체 토큰 리스트 길이 보다 재시도 횟수가 작을경우 반복한다
    while (this.tokenList.length >= retryCount) {
      // fetcher 시도
      try {
        let TOKEN = this.getToken();
        const USER_NAME = username;
        let result;
        if (!!option) {
          result = await fetcher(TOKEN, USER_NAME);
        } else {
          result = await fetcher(TOKEN, USER_NAME, option);
        }

        // 성공했을 경우 데이터 리턴
        return result;
      } catch (error) {
        console.log(error);

        let ERROR_CODE = error.response.code;
        let ERROR_MESSAGE = error.response.message;
        let ERROR_STATUS = error.status;

        // 토큰의 접근 가능한 횟수가 초과되었을 경우
        if (ERROR_STATUS === 403) {
          // 토큰을 변경한다
          if (!this.changeToken()) {
            throw new HttpException({ code: 'tokenManager.githubApiFetcher.changeTokenfail', message: '토큰 변경에 실패했습니다' }, 500);
          }

          // 재시도 횟수 증가
          retryCount++;
        } else {
          // 발생된 에러를 전달하고 마친다
          throw new HttpException({ code: ERROR_CODE, message: ERROR_MESSAGE }, ERROR_STATUS);
        }
      }
    }
    throw new HttpException({ code: 'tokenManager.githubApiFetcher.RATE_LIMITED', message: '서비스 제공가능한 토큰이 모두 소진되었습니다' }, 500);
  }
}
