import { Test, TestingModule } from '@nestjs/testing';
import { CurrentService } from './current.service';

describe('CurrentService', () => {
  let service: CurrentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrentService],
    }).compile();

    service = module.get<CurrentService>(CurrentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
