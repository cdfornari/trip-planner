import { Injectable } from '@nestjs/common';

@Injectable()
export class QueryApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
