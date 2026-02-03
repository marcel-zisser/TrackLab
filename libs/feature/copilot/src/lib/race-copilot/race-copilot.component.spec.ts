import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaceCopilotComponent } from './race-copilot.component';

describe('RaceCopilotComponent', () => {
  let component: RaceCopilotComponent;
  let fixture: ComponentFixture<RaceCopilotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceCopilotComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RaceCopilotComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
