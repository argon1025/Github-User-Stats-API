import { Injectable, Logger } from '@nestjs/common';
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
    } else {
      // 토큰스코프를 +1 증가시킨다
      this.setTokenScope(this.getTokenScope() + 1);
    }
  }
}
