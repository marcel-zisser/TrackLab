import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReliabilityTrackerComponent } from './reliability-tracker.component';

describe('ReliabilityTrackerComponent', () => {
  let component: ReliabilityTrackerComponent;
  let fixture: ComponentFixture<ReliabilityTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReliabilityTrackerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReliabilityTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
