import { Controller, Get } from '@nestjs/common';
import { ProjectorsService } from './projectors.service';

@Controller()
export class ProjectorsController {
  constructor(private readonly projectorsService: ProjectorsService) {}

  @Get()
  getHello(): string {
    return this.projectorsService.getHello();
  }
}
