import { Test, TestingModule } from '@nestjs/testing';
import { LiveDataService } from './live-data.service';

describe('LiveDataService', () => {
  let service: LiveDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveDataService],
    }).compile();

    service = module.get<LiveDataService>(LiveDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
