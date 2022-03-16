import { PinnedRepo } from 'src/repo/dto/repo.dto';
import { TopLanguage, UserStats } from 'src/stats/dto/stats.dto';

export class CacheUserStats extends UserStats {}
export class CacheTopLanguage extends TopLanguage {}
export class CachePinnedRepo extends PinnedRepo {}
