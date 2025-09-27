import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DriverInputAnalysisComponent } from './driver-input-analysis.component';

describe('DriverInputComponent', () => {
  let component: DriverInputAnalysisComponent;
  let fixture: ComponentFixture<DriverInputAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverInputAnalysisComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DriverInputAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
