import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { BackendService } from '@tracklab/services';
import { Event, Lap, LapsResponse, RaceSelection } from '@tracklab/models';
import { AnalysisBaseComponent, SourceSelectionComponent } from '../../analysis-base';
import { first } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ChartBaseComponent } from '../../analysis-base/chart-base/chart-base.component';
import { convertToMilliseconds, millisecondsToTimingString } from '@tracklab/util';

@Component({
  selector: 'tl-laptime-scatter',
  imports: [
    AnalysisBaseComponent,
    SourceSelectionComponent,
    FormsModule,
    ChartBaseComponent,
  ],
  templateUrl: './laptime-scatter.component.html',
  styleUrl: './laptime-scatter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaptimeScatterComponent {
  private readonly backendService = inject(BackendService);

  protected selectedYear: string | undefined;
  protected selectedEvent: Event | undefined;
  protected selectedSession: string | undefined;
  protected driver: string | undefined;

  protected readonly laps = signal<Lap[] | undefined>(undefined);

  protected readonly processedData = computed(() =>
    this.processData(this.laps()),
  );
  protected drivers = computed(() =>
    Array.from(this.processedData()?.keys() ?? []),
  );

  protected readonly chartOptions = computed(() => this.createChartOptions());

  /**
   * Loads the laptime data for a given driver
   * @protected
   */
  protected loadLapTimes(selectedRace: RaceSelection) {
    if (
      selectedRace.year &&
      selectedRace.event &&
      selectedRace.session &&
      selectedRace.drivers
    ) {
      this.selectedYear = selectedRace.year;
      this.selectedEvent = selectedRace.event;
      this.selectedSession = selectedRace.session;
      this.driver = selectedRace.drivers[0];

      this.laps.set(undefined);

      this.backendService
        .doGet<LapsResponse>(
          `fast-f1/laps?year=${selectedRace.year}&round=${selectedRace.event?.roundNumber}&session=${selectedRace.session}&driver=${selectedRace.drivers[0]}`,
        )
        .pipe(first((response) => !!response))
        .subscribe({
          next: (response) => {
            this.laps.set(response?.laps ?? []);
          },
        });
    }
  }

  /**
   * Processes the laptime data from the backend
   * @private
   */
  private processData(data: Lap[] | undefined) {
    if (!data) {
      return undefined;
    }

    return data.map((lap) => [
      lap.lapNumber,
      convertToMilliseconds(lap.lapTime),
      lap.tireCompound,
    ]);
  }

  /**
   * Create the options for the laptime scatter chart
   * @private
   */
  private createChartOptions() {
    return {
      title: {
        text: 'Driver Laptimes',
        left: 'center',
      },
      grid: {
        left: 50,
        containLabel: true,
      },
      yAxis: {
        type: 'value',
        name: 'Lap Time',
        axisLabel: {
          formatter: (val: number) => millisecondsToTimingString(val),
        },
      },
      xAxis: {
        type: 'value',
        name: 'Laps',
      },
      dataZoom: [
        {
          type: 'inside',
          start: 100,
          end: 0,
        },
      ],
      series: {
        type: 'scatter',
        data: this.processedData(),
      },
    };
  }
}
