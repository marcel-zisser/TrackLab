import { beforeEach, describe, expect, it } from "vitest";
import { TestBed } from '@angular/core/testing';
import { RaceAnalysisService } from './race-analysis.service';
describe('RaceAnalysisService', () => {
  let service: RaceAnalysisService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaceAnalysisService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
