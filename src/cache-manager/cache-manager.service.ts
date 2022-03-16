import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CachePinnedRepo, CacheTopLanguage, CacheUserStats } from './dto/cache-manager.dto';
// import { UserStats } from 'src/stats/interface/UserStats.interface';

@Injectable()
export class CacheManagerService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getUserStats(username: string): Promise<CacheUserStats> {
    return await this.cacheManager.get(`UserStats::${username}`);
  }
  async setUserStats(username: string, value: CacheUserStats): Promise<void> {
    await this.cacheManager.set(`UserStats::${username}`, value);
  }
  async getTopLanguage(username: string): Promise<CacheTopLanguage[]> {
    return await this.cacheManager.get(`TopLanguage::${username}`);
  }
  async setTopLanguage(username: string, value: CacheTopLanguage[]): Promise<void> {
    await this.cacheManager.set(`TopLanguage::${username}`, value);
  }

  async getPinnedRepo(username: string): Promise<CachePinnedRepo[]> {
    return await this.cacheManager.get(`PinnedRepo::${username}`);
  }
  async setPinnedRepo(username: string, value: CachePinnedRepo[]): Promise<void> {
    await this.cacheManager.set(`PinnedRepo::${username}`, value);
  }
}
