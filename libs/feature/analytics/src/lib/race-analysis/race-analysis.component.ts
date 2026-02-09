import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventSelectionComponent } from './race-selection/race-selection.component';
import { RaceAnalysisContentComponent } from './race-analysis-content/race-analysis-content.component';

@Component({
  selector: 'tl-race-analysis',
  templateUrl: './race-analysis.component.html',
  styleUrl: './race-analysis.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, EventSelectionComponent, RaceAnalysisContentComponent],
})
export class RaceAnalysisComponent {}
