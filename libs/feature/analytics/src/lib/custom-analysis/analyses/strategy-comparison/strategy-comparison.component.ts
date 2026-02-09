import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { EventSelection } from '@tracklab/models';
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
  protected readonly eventSelection = signal<EventSelection | undefined>(
    undefined,
  );

  /**
   * Effect to load the strategy data, once all inputs have been selected
   * @protected
   */
  protected loadStrategyData(selectedRace: EventSelection) {
    this.eventSelection.set(selectedRace);
  }
}
