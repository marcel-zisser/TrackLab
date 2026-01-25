import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { BackendService } from '@tracklab/services';
import {
  Duration,
  Lap,
  LapsResponse,
  RaceSelection,
  Sector,
} from '@tracklab/models';
import { first } from 'rxjs';
import { FormsModule } from '@angular/forms';
import {
  convertToMilliseconds,
  millisecondsToTimingString,
} from '@tracklab/util';
import { AnalyticsStore } from '../../store';
import { BaseChart, ChartBaseComponent } from '@tracklab/shared/components';

@Component({
  selector: 'tl-sector-comparison-chart',
  imports: [FormsModule, ChartBaseComponent],
  providers: [
    { provide: BaseChart, useExisting: SectorComparisonChartComponent },
  ],
  templateUrl: './sector-comparison-chart.component.html',
  styleUrl: './sector-comparison-chart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectorComparisonChartComponent extends BaseChart {
  raceSelection = input.required<RaceSelection | undefined>();
  sector = input.required<Sector | undefined>();
  fastestSectorTime = output<number | undefined>();

  chart = viewChild.required<ChartBaseComponent>('chartBase');

  private readonly backendService = inject(BackendService);
  private readonly store = inject(AnalyticsStore);

  protected readonly laps = signal<Lap[] | undefined>(undefined);

  protected readonly fastestSectorTimePerDriver = computed(() => {
    const sector = this.sector();
    const laps = this.laps() ?? [];
    const fastestSectorPerDriver = new Map<string, [number, string]>();

    for (const lap of laps) {
      let sectorTime: Duration | undefined;

      switch (sector) {
        case Sector.Sector1:
          sectorTime = lap.sector1Time;
          break;
        case Sector.Sector2:
          sectorTime = lap.sector2Time;
          break;
        case Sector.Sector3:
          sectorTime = lap.sector3Time;
          break;
      }

      if (!sectorTime) {
        continue;
      }

      const sectorMilliseconds = convertToMilliseconds(sectorTime);
      const driverFastestSector = fastestSectorPerDriver.get(lap.driver)?.[0];

      if (
        (driverFastestSector === undefined ||
          driverFastestSector > sectorMilliseconds) &&
        sectorMilliseconds > 0
      ) {
        fastestSectorPerDriver.set(lap.driver, [
          sectorMilliseconds,
          this.store.colors()?.driverColors[lap.driver] ?? 'black',
        ]);
      }
    }

    const sortedSectorTimes = Array.from(fastestSectorPerDriver.entries()).sort(
      (a, b) => a[1][0] - b[1][0],
    );
    this.fastestSectorTime.emit(sortedSectorTimes?.[0]?.[1]?.[0] ?? undefined);
    return sortedSectorTimes;
  });

  protected readonly sectorGapData = computed(() => {
    const sortedSectorTimes = this.fastestSectorTimePerDriver();

    if(sortedSectorTimes.length === 0) {
      return undefined;
    }

    for (let index = sortedSectorTimes.length - 1; index >= 0; index--) {
      sortedSectorTimes[index][1][0] =
        sortedSectorTimes[index][1][0] - sortedSectorTimes[0][1][0];
    }

    return new Map(sortedSectorTimes.slice(0, 10));
  });

  readonly chartOptions = linkedSignal(() => this.createChartOptions());

  constructor() {
    super();
    effect(() => {
      const raceSelection = this.raceSelection();
      if (raceSelection) {
        this.loadData(raceSelection);
      }
    });
  }

  /**
   * Effect to load the position data for a given race
   * @protected
   */
  protected loadData(selectedRace: RaceSelection) {
    if (selectedRace.year && selectedRace.event) {
      this.laps.set(undefined);

      this.backendService
        .doGet<LapsResponse>(
          `fast-f1/laps?year=${selectedRace.year}&round=${selectedRace.event?.roundNumber}&session=Race`,
        )
        .pipe(first((response) => !!response))
        .subscribe({
          next: (response) => {
            this.laps.set(response.laps);
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
        text: 'Gap to Sector Best Time',
        left: 'center',
        top: 0,
      },
      grid: {
        left: 5,
        top: 40,
        bottom: 15,
        containLabel: true, // ensures labels aren't cut off
      },
      xAxis: {
        type: 'value',
        name: 'Time Difference',
        axisLabel: {
          formatter: (val: number) => millisecondsToTimingString(val),
        },
      },
      yAxis: {
        type: 'category',
        name: 'Driver',
        inverse: true,
        data: Array.from(this.sectorGapData()?.keys() ?? []),
      },
      tooltip: {
        show: false,
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
        selectedMode: true,
      },
      series: [this.createDriverSeries()],
    };
  }

  /**
   * Creates the series for each driver
   * @private
   */
  private createDriverSeries() {
    return {
      type: 'bar',
      data: Array.from(this.sectorGapData()?.values() ?? []).map(([diff, color]) => ({
        value: diff,
        itemStyle: {
          color: color,
        },
      })),
      label: {
        show: true,
        position: 'right',
        formatter: function (params: any) {
          const value: number = params.data.value;
          return '+' + millisecondsToTimingString(value);
        },
      },
    };
  }

  protected readonly millisecondsToTimingString = millisecondsToTimingString;
}
