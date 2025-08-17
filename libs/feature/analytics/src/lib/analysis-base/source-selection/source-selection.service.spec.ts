import { TestBed } from '@angular/core/testing';

import { SourceSelectionService } from './source-selection.service';

describe('SourceSelectionService', () => {
  let service: SourceSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SourceSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
