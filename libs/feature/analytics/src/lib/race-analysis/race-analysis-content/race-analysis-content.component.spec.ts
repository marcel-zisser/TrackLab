import { beforeEach, describe, expect, it } from "vitest";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaceAnalysisContentComponent } from './race-analysis-content.component';
describe('RaceAnalysisContentComponent', () => {
  let component: RaceAnalysisContentComponent;
  let fixture: ComponentFixture<RaceAnalysisContentComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceAnalysisContentComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(RaceAnalysisContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
