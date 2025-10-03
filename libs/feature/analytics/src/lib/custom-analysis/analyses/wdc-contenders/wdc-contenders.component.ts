import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  AnalysisBaseComponent,
  SourceSelectionComponent,
} from '../../analysis-base';
import { WdcContendersChartComponent } from '../../../charts';
import { RaceSelection } from '@tracklab/models';

@Component({
  selector: 'tl-wdc-contenders',
  imports: [
    AnalysisBaseComponent,
    SourceSelectionComponent,
    WdcContendersChartComponent,
  ],
  templateUrl: './wdc-contenders.component.html',
  styleUrl: './wdc-contenders.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WdcContendersComponent {
  protected readonly raceSelection = signal<RaceSelection | undefined>(
    undefined,
  );

  loadWdcContendersData(selection: RaceSelection) {
    this.raceSelection.set(selection);
  }
}
