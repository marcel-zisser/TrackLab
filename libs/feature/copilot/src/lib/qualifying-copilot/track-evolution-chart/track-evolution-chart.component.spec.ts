import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackEvolutionChartComponent } from './track-evolution-chart.component';

describe('TrackEvolutionChartComponent', () => {
  let component: TrackEvolutionChartComponent;
  let fixture: ComponentFixture<TrackEvolutionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackEvolutionChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackEvolutionChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
