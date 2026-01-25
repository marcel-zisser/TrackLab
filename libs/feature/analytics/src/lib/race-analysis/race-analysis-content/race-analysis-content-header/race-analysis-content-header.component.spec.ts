import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaceAnalysisContentHeaderComponent } from './race-analysis-content-header.component';

describe('RaceAnalysisContentHeaderComponent', () => {
  let component: RaceAnalysisContentHeaderComponent;
  let fixture: ComponentFixture<RaceAnalysisContentHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceAnalysisContentHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RaceAnalysisContentHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
