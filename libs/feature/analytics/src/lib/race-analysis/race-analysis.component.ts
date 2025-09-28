import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RaceAnalysisStore } from './store/race-analysis.store';
import { FormsModule } from '@angular/forms';
import { RaceSelectionComponent } from './race-selection/race-selection.component';
import { RaceAnalysisContentComponent } from './race-analysis-content/race-analysis-content.component';

@Component({
  selector: 'tl-race-analysis',
  providers: [RaceAnalysisStore],
  templateUrl: './race-analysis.component.html',
  styleUrl: './race-analysis.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RaceSelectionComponent, RaceAnalysisContentComponent],
})
export class RaceAnalysisComponent {}
