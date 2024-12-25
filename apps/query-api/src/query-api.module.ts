import { Module } from '@nestjs/common';
import { QueryApiController } from './query-api.controller';
import { QueryApiService } from './query-api.service';

@Module({
  imports: [],
  controllers: [QueryApiController],
  providers: [QueryApiService],
})
export class QueryApiModule {}
