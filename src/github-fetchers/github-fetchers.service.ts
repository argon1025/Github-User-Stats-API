import { HttpException, Injectable } from '@nestjs/common';
import { async, catchError, lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { TokenManagerService } from 'src/tokenManager/tokenManager.service';
import { AxiosRequestConfig } from 'axios';
@Injectable()
export class GithubFetchersService {
  constructor(private readonly tokenManagerService: TokenManagerService, private readonly httpService: HttpService) {}
  /**
   * @TODO
   * ErrorHandling
   * token 인증에러
   * 400번대 에러
   *
   */
  postRequest = async (query) => {
    const url = 'https://api.github.com/graphql';
    while (this.tokenManagerService.tokenLength > this.tokenManagerService.tryCount) {
      try {
        const config = {
          headers: {
            Authorization: `bearer ${this.tokenManagerService.getToken()}`,
          },
        };
        const result = await lastValueFrom(this.httpService.post(url, query, config).pipe(map((res) => res.data)));
        return result;
      } catch (error) {
        const isBadCredentials = error.response.status === 401;
        if (isBadCredentials) this.tokenManagerService.changeToken();
      }
    }
  };

  getRequest = async (url, params) => {
    while (this.tokenManagerService.tokenLength > this.tokenManagerService.tryCount) {
      console.log(this.tokenManagerService.getToken());
      try {
        const config: AxiosRequestConfig = {
          params: params,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${this.tokenManagerService.getToken()}`,
          },
        };
        const result = await lastValueFrom(this.httpService.get(url, config).pipe(map((res) => res.data)));
        return result;
      } catch (error) {
        const isBadCredentials = error.response.status === 401;
        if (isBadCredentials) this.tokenManagerService.changeToken();
      }
    }
  };
}
