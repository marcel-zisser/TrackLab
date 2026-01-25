import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaderGapBarChartComponent } from './leader-gap-bar-chart.component';

describe('PositionChangesChartComponent', () => {
  let component: LeaderGapBarChartComponent;
  let fixture: ComponentFixture<LeaderGapBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderGapBarChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderGapBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
