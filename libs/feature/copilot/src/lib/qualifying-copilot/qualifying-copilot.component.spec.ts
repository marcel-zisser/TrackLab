import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QualifyingCopilotComponent } from './qualifying-copilot.component';

describe('QualifyingCopilotComponent', () => {
  let component: QualifyingCopilotComponent;
  let fixture: ComponentFixture<QualifyingCopilotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualifyingCopilotComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QualifyingCopilotComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
