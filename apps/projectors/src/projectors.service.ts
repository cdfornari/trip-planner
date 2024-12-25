import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectorsService {
  getHello(): string {
    return 'Hello World!';
  }
}
