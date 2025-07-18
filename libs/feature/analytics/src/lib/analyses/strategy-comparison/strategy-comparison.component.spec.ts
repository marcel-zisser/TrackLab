import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StrategyComparisonComponent } from './strategy-comparison.component';

describe('TeamPaceComparisonComponent', () => {
  let component: StrategyComparisonComponent;
  let fixture: ComponentFixture<StrategyComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategyComparisonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StrategyComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
