import { Test, TestingModule } from '@nestjs/testing';
import { SplitwiseService } from './splitwise.service';

describe('SplitwiseService', () => {
  let service: SplitwiseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SplitwiseService],
    }).compile();

    service = module.get<SplitwiseService>(SplitwiseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
