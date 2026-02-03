import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalysisModeSelectionComponent } from './analysis-mode-selection.component';

describe('AnalysisModeSelectionComponent', () => {
  let component: AnalysisModeSelectionComponent;
  let fixture: ComponentFixture<AnalysisModeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisModeSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysisModeSelectionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
