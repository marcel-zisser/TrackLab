import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WdcContendersChartComponent } from './wdc-contenders-chart.component';

describe('WdcContendersComponent', () => {
  let component: WdcContendersChartComponent;
  let fixture: ComponentFixture<WdcContendersChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WdcContendersChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WdcContendersChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
