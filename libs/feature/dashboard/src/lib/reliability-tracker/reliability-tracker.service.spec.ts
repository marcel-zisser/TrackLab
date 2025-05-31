import { TestBed } from '@angular/core/testing';

import { ReliabilityTrackerService } from './reliability-tracker.service';

describe('ReliabilityTrackerService', () => {
  let service: ReliabilityTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReliabilityTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
