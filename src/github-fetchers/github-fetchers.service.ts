import { HttpException, Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { TokenManagerService } from 'src/tokenManager/tokenManager.service';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getRequestConfig, postRequestConfig } from './dto/github-fetcher.dto';
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
  async postRequest(query: postRequestConfig): Promise<AxiosResponse> {
    const url = 'https://api.github.com/graphql';
    console.log(this.tokenManagerService.getToken());
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
      if (isBadCredentials) {
        this.tokenManagerService.changeToken();
        throw new HttpException({ message: 'changed Token' }, 401);
      } else {
        throw new HttpException({ message: error.message }, error.response.status);
      }
    }
  }

  async getRequest(url: string, params: getRequestConfig): Promise<any> {
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
      if (isBadCredentials) {
        this.tokenManagerService.changeToken();
        throw new HttpException({ message: 'changed Token' }, 401);
      } else {
        throw new HttpException({ message: error.message }, error.response.status);
      }
    }
  }
}
