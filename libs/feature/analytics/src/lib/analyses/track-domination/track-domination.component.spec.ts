import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackDominationComponent } from './track-domination.component';

describe('GearShiftComponent', () => {
  let component: TrackDominationComponent;
  let fixture: ComponentFixture<TrackDominationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackDominationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackDominationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
