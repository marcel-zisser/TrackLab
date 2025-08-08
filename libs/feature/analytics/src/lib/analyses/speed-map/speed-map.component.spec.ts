import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpeedMapComponent } from './speed-map.component';

describe('GearShiftComponent', () => {
  let component: SpeedMapComponent;
  let fixture: ComponentFixture<SpeedMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeedMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpeedMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
