import { Module } from '@nestjs/common';
import { ProjectorsController } from './projectors.controller';
import { ProjectorsService } from './projectors.service';

@Module({
  imports: [],
  controllers: [ProjectorsController],
  providers: [ProjectorsService],
})
export class ProjectorsModule {}
