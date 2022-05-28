import { Test, TestingModule } from '@nestjs/testing';
import { SynchronizationsService } from './synchronizations.service';

describe('SynchronizationsService', () => {
  let service: SynchronizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SynchronizationsService],
    }).compile();

    service = module.get<SynchronizationsService>(SynchronizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
