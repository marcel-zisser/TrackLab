import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DriverStandingsComponent } from './driver-standings.component';

describe('StandingsComponent', () => {
  let component: DriverStandingsComponent;
  let fixture: ComponentFixture<DriverStandingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverStandingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DriverStandingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
