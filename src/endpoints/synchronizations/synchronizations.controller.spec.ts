import { Test, TestingModule } from '@nestjs/testing';
import { SynchronizationsController } from './synchronizations.controller';
import { SynchronizationsService } from './synchronizations.service';

describe('SynchronizationsController', () => {
  let controller: SynchronizationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SynchronizationsController],
      providers: [SynchronizationsService],
    }).compile();

    controller = module.get<SynchronizationsController>(SynchronizationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
