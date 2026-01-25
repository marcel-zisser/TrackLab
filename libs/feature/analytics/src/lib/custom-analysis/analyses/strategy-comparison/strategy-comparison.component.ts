import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RaceSelection } from '@tracklab/models';
import {
  AnalysisBaseComponent,
  SourceSelectionComponent,
} from '../../analysis-base';
import { StrategyComparisonChartComponent } from '../../../charts';

@Component({
  selector: 'tl-strategy-comparison',
  imports: [
    AnalysisBaseComponent,
    SourceSelectionComponent,
    StrategyComparisonChartComponent,
  ],
  templateUrl: './strategy-comparison.component.html',
  styleUrl: './strategy-comparison.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StrategyComparisonComponent {
  protected readonly raceSelection = signal<RaceSelection | undefined>(
    undefined,
  );

  /**
   * Effect to load the strategy data, once all inputs have been selected
   * @protected
   */
  protected loadStrategyData(selectedRace: RaceSelection) {
    this.raceSelection.set(selectedRace);
  }
}
