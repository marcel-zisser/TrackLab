import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PositionChangesChartComponent } from './position-changes-chart.component';
describe('PositionChangesChartComponent', () => {
  let component: PositionChangesChartComponent;
  let fixture: ComponentFixture<PositionChangesChartComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionChangesChartComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(PositionChangesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
