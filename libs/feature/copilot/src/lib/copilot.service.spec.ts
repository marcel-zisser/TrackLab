import { TestBed } from '@angular/core/testing';

import { CopilotService } from './copilot.service';

describe('CopilotService', () => {
  let service: CopilotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CopilotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
