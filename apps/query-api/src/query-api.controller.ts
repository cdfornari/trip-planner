import { Controller, Get } from '@nestjs/common';
import { QueryApiService } from './query-api.service';

@Controller()
export class QueryApiController {
  constructor(private readonly queryApiService: QueryApiService) {}

  @Get()
  getHello(): string {
    return this.queryApiService.getHello();
  }
}
