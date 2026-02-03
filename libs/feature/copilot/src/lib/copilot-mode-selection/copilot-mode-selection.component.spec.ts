import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CopilotModeSelectionComponent } from './copilot-mode-selection.component';

describe('CopilotModeSelectionComponent', () => {
  let component: CopilotModeSelectionComponent;
  let fixture: ComponentFixture<CopilotModeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopilotModeSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CopilotModeSelectionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
