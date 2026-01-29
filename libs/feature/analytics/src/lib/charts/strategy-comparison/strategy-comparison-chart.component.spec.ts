import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StrategyComparisonChartComponent } from './strategy-comparison-chart.component';
describe('StrategyComparisonComponent', () => {
  let component: StrategyComparisonChartComponent;
  let fixture: ComponentFixture<StrategyComparisonChartComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategyComparisonChartComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(StrategyComparisonChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
