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
  Duration,
  Lap,
  LapsResponse,
  RaceSelection,
  Sector,
  SelectionOption,
} from '@tracklab/models';
import { first } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ChartBaseComponent } from '../../custom-analysis/analysis-base/chart-base/chart-base.component';
import {
  convertToMilliseconds,
  millisecondsToTimingString,
} from '@tracklab/util';
import { AnalyticsStore } from '../../store';
import { SelectButton } from 'primeng/selectbutton';

@Component({
  selector: 'tl-sector-comparison-chart',
  imports: [FormsModule, ChartBaseComponent, SelectButton],
  templateUrl: './sector-comparison-chart.component.html',
  styleUrl: './sector-comparison-chart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectorComparisonChartComponent {
  raceSelection = input.required<RaceSelection | undefined>();

  private readonly backendService = inject(BackendService);
  private readonly store = inject(AnalyticsStore);

  protected readonly sectors: SelectionOption<string, Sector>[] = [
    { label: 'Sector 1', value: Sector.Sector1 },
    { label: 'Sector 2', value: Sector.Sector2 },
    { label: 'Sector 3', value: Sector.Sector3 },
  ];
  protected readonly sector = signal<number>(1);
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

    return Array.from(fastestSectorPerDriver.entries()).sort(
      (a, b) => a[1][0] - b[1][0],
    );
  });

  protected fastestSectorTime = computed(
    () => this.fastestSectorTimePerDriver()?.[0]?.[1]?.[0] ?? undefined,
  );

  protected readonly sectorGapData = computed(() => {
    const sortedSectorTimes = this.fastestSectorTimePerDriver();

    for (let index = sortedSectorTimes.length - 1; index >= 0; index--) {
      sortedSectorTimes[index][1][0] =
        sortedSectorTimes[index][1][0] - sortedSectorTimes[0][1][0];
    }

    return new Map(sortedSectorTimes);
  });

  protected readonly chartOptions = computed(() => this.createChartOptions());

  constructor() {
    effect(() => {
      const raceSelection = this.raceSelection();
      if (raceSelection) {
        this.loadLapData(raceSelection);
      }
    });
  }

  /**
   * Effect to load the position data for a given race
   * @protected
   */
  protected loadLapData(selectedRace: RaceSelection) {
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
        data: Array.from(this.sectorGapData().keys()),
      },
      tooltip: {
        show: true,
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
      data: Array.from(this.sectorGapData().values()).map(([diff, color]) => ({
        value: diff,
        itemStyle: {
          color: color,
        },
      })),
    };
  }

  protected readonly millisecondsToTimingString = millisecondsToTimingString;
}
