import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModeSelectionComponent } from '@tracklab/components';

@Component({
  selector: 'tl-copilot-mode-selection',
  imports: [ModeSelectionComponent, RouterModule],
  templateUrl: './copilot-mode-selection.component.html',
  styleUrl: './copilot-mode-selection.component.css',
})
export class CopilotModeSelectionComponent {}
