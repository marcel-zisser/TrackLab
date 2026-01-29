import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaderGapLineChartComponent } from './leader-gap-line-chart.component';
describe('PositionChangesChartComponent', () => {
  let component: LeaderGapLineChartComponent;
  let fixture: ComponentFixture<LeaderGapLineChartComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderGapLineChartComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(LeaderGapLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
