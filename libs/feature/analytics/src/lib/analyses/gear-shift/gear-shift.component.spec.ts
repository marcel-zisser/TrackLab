import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GearShiftComponent } from './gear-shift.component';

describe('GearShiftComponent', () => {
  let component: GearShiftComponent;
  let fixture: ComponentFixture<GearShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GearShiftComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GearShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
