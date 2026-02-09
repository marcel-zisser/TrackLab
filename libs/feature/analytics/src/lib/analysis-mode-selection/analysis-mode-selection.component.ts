import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModeSelectionComponent } from "@tracklab/components";

@Component({
  selector: 'tl-analysis-mode-selection',
  imports: [ModeSelectionComponent, RouterModule],
  templateUrl: './analysis-mode-selection.component.html',
  styleUrl: './analysis-mode-selection.component.css',
})
export class AnalysisModeSelectionComponent {}
