import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaceAnalysisChartTileComponent } from './race-analysis-chart-tile.component';
describe('RaceAnalysisChartTileComponent', () => {
  let component: RaceAnalysisChartTileComponent;
  let fixture: ComponentFixture<RaceAnalysisChartTileComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceAnalysisChartTileComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(RaceAnalysisChartTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
