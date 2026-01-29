import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaceAnalysisContentChartsComponent } from './race-analysis-content-charts.component';
describe('RaceAnalysisContentChartsComponent', () => {
  let component: RaceAnalysisContentChartsComponent;
  let fixture: ComponentFixture<RaceAnalysisContentChartsComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceAnalysisContentChartsComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(RaceAnalysisContentChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
