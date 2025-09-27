import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaceAnalysisComponent } from './race-analysis.component';

describe('RaceComponent', () => {
  let component: RaceAnalysisComponent;
  let fixture: ComponentFixture<RaceAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceAnalysisComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RaceAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
