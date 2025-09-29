import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { BackendService } from '@tracklab/services';
import {
  DriverPositionPayload,
  DriverPositionResponse,
  EventData,
  RaceSelection,
} from '@tracklab/models';
import { first } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ChartBaseComponent } from '../../custom-analysis/analysis-base/chart-base/chart-base.component';

@Component({
  selector: 'tl-position-changes-chart',
  imports: [FormsModule, ChartBaseComponent],
  templateUrl: './position-changes-chart.component.html',
  styleUrl: './position-changes-chart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PositionChangesChartComponent {
  raceSelection = input.required<RaceSelection | undefined>();

  private readonly backendService = inject(BackendService);

  protected selectedYear: string | undefined;
  protected selectedEvent: EventData | undefined;

  protected readonly positionData = signal<DriverPositionPayload | undefined>(
    undefined,
  );

  protected readonly drivers = computed<string[]>(() =>
    Object.keys(this.positionData() ?? []),
  );
  protected readonly laps = computed(() => {
    const laps: number[] = [];

    for (const driver of this.drivers() ?? []) {
      laps.push(this.positionData()?.[driver]?.positions.length ?? 0);
    }

    return Math.max(...laps);
  });
  protected readonly chartOptions = computed(() => this.createChartOptions());

  constructor() {
    effect(() => {
      const raceSelection = this.raceSelection();
      if (raceSelection) {
        this.loadPositionData(raceSelection);
      }
    });
  }

  /**
   * Effect to load the position data for a given race
   * @protected
   */
  protected loadPositionData(selectedRace: RaceSelection) {
    if (selectedRace.year && selectedRace.event) {
      this.selectedYear = selectedRace.year;
      this.selectedEvent = selectedRace.event;

      this.positionData.set(undefined);

      this.backendService
        .doGet<DriverPositionResponse>(
          `fast-f1/position-data?year=${selectedRace.year}&round=${selectedRace.event?.roundNumber}`,
        )
        .pipe(first((response) => !!response))
        .subscribe({
          next: (positionData) => {
            this.positionData.set(positionData.payload);
          },
        });
    }
  }

  /**
   * Create the options for the position change chart
   * @private
   */
  private createChartOptions() {
    return {
      title: {
        text: 'Driver Positions Over Race Distance',
        left: 'center',
      },
      grid: {
        left: 0,
        top: 45,
        bottom: 10,
        containLabel: true, // ensures labels aren't cut off
      },
      yAxis: {
        type: 'value',
        name: 'Position',
        inverse: true,
        interval: 1,
        startValue: 1,
        max: this.drivers()?.length,
      },
      xAxis: {
        type: 'value',
        name: 'Lap',
        max: this.laps(),
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        enterable: true,
        order: 'valueAsc',
        appendTo: 'body',
        className: 'tl-tooltip',
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        top: 'center',
        right: 0,
        scroll: true,
        data: [...this.createDriverLegend()],
        selectedMode: true,
      },
      dataZoom: [
        {
          type: 'inside',
          start: 100,
          end: 0,
        },
      ],
      series: [...this.createDriverSeries()],
    };
  }

  /**
   * Creates the series for each driver
   * @private
   */
  private createDriverSeries() {
    return (
      this.drivers()?.map((driver) => ({
        type: 'line',
        name: driver,
        data:
          this.positionData()?.[driver].positions?.map((position, index) => [
            index,
            position,
          ]) ?? [],
        showSymbol: false,
        lineStyle: {
          color: this.positionData()?.[driver].color,
          type: this.positionData()?.[driver].lineStyle,
        },
        itemStyle: {
          color: this.positionData()?.[driver].color,
        },
        emphasis: {
          focus: 'series', // highlight this series on hover (legend or chart)
        },
        endLabel: {
          show: false,
        },
        blur: {
          lineStyle: { opacity: 0.2 }, // dim when not focused
        },
      })) ?? []
    );
  }

  /**
   * Creates the legend configuration for each driver
   * @private
   */
  private createDriverLegend() {
    return (
      this.drivers()?.map((driver) => {
        const legend = {
          name: driver,
          icon: '',
          itemStyle: {
            color: this.positionData()?.[driver]?.color,
          },
        };

        if (this.positionData()?.[driver]?.lineStyle === 'solid') {
          legend.icon = 'path://M0,3 h6 v1 h-6 Z';
        } else {
          legend.icon =
            'path://M0,3 h2 v1 h-2 Z M3,3 h2 v1 h-2 Z M6,3 h2 v1 h-2 Z';
        }

        return legend;
      }) ?? []
    );
  }
}
