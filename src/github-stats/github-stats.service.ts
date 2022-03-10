import { Injectable } from '@nestjs/common';
import { UpdateGithubStatDto } from './dto/update-github-stat.dto';
@Injectable()
export class GithubStatsService {
  constructor() {}
  findAll() {
    return `This action returns all githubStats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} githubStat`;
  }

  update(id: number, updateGithubStatDto: UpdateGithubStatDto) {
    return `This action updates a #${id} githubStat`;
  }

  remove(id: number) {
    return `This action removes a #${id} githubStat`;
  }
}
