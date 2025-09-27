import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalysisHostComponent } from './analysis-host.component';

describe('AnalysisHostComponent', () => {
  let component: AnalysisHostComponent;
  let fixture: ComponentFixture<AnalysisHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysisHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
