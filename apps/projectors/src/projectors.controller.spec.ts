import { Test, TestingModule } from '@nestjs/testing';
import { ProjectorsController } from './projectors.controller';
import { ProjectorsService } from './projectors.service';

describe('ProjectorsController', () => {
  let projectorsController: ProjectorsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProjectorsController],
      providers: [ProjectorsService],
    }).compile();

    projectorsController = app.get<ProjectorsController>(ProjectorsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(projectorsController.getHello()).toBe('Hello World!');
    });
  });
});
