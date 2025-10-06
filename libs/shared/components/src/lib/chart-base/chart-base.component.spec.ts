import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartBaseComponent } from './chart-base.component';

describe('ChartBaseComponent', () => {
  let component: ChartBaseComponent;
  let fixture: ComponentFixture<ChartBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartBaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
