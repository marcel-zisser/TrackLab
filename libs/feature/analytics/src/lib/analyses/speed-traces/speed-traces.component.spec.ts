import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpeedTracesComponent } from './speed-traces.component';

describe('SpeedTracesComponent', () => {
  let component: SpeedTracesComponent;
  let fixture: ComponentFixture<SpeedTracesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeedTracesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpeedTracesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
