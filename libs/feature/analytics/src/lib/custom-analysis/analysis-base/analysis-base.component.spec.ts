import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalysisBaseComponent } from './analysis-base.component';

describe('AnalysisBaseComponent', () => {
  let component: AnalysisBaseComponent;
  let fixture: ComponentFixture<AnalysisBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisBaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysisBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
