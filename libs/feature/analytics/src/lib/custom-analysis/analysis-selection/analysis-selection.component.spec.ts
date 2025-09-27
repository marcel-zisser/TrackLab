import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalysisSelectionComponent } from './analysis-selection.component';

describe('AnalysisSelectionComponent', () => {
  let component: AnalysisSelectionComponent;
  let fixture: ComponentFixture<AnalysisSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysisSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
