import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { EventSelection } from '@tracklab/models';
import { FormsModule } from '@angular/forms';
import { AnalysisBaseComponent, SourceSelectionComponent } from '../../analysis-base';
import { PositionChangesChartComponent } from '../../../charts';

@Component({
  selector: 'tl-position-changes',
  imports: [
    AnalysisBaseComponent,
    SourceSelectionComponent,
    FormsModule,
    AnalysisBaseComponent,
    PositionChangesChartComponent,
  ],
  templateUrl: './position-changes.component.html',
  styleUrl: './position-changes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PositionChangesComponent {
  protected readonly eventSelection = signal<EventSelection | undefined>(
    undefined,
  );

  /**
   * Effect to load the position data for a given race
   * @protected
   */
  protected loadPositionData(selectedRace: EventSelection) {
    this.eventSelection.set(selectedRace);
  }
}
