import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { BackendService } from '@tracklab/services';
import {
  LeaderGapPayload,
  LeaderGapResponse,
  RaceSelection,
} from '@tracklab/models';
import { first } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ChartBaseComponent } from '../chart-base/chart-base.component';
import {
  convertToMilliseconds,
  millisecondsToTimingString,
} from '@tracklab/util';
import { AnalyticsStore } from '../../store';
import { BaseChart } from '../chart-base/models/base-chart';

@Component({
  selector: 'tl-leader-gap-bar-chart',
  imports: [FormsModule, ChartBaseComponent],
  providers: [{ provide: BaseChart, useExisting: LeaderGapBarChartComponent }],
  templateUrl: './leader-gap-bar-chart.component.html',
  styleUrl: './leader-gap-bar-chart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaderGapBarChartComponent extends BaseChart {
  raceSelection = input.required<RaceSelection | undefined>();

  private readonly backendService = inject(BackendService);
  private readonly store = inject(AnalyticsStore);

  protected readonly gapData = signal<LeaderGapPayload | undefined>(undefined);

  protected readonly drivers = computed<string[]>(() =>
    Object.keys(this.gapData() ?? []),
  );

  protected readonly gaps = computed(() => {
    const gapData = this.gapData();
    const totalLaps = this.laps();
    const gaps: [string, [number, string]][] = [];

    for (const driver of this.drivers()) {
      const laps = gapData?.[driver]?.gaps ?? [];

      if (laps.length < totalLaps) {
        continue;
      }

      gaps.push([
        driver,
        [
          convertToMilliseconds(laps[laps.length - 1]),
          this.store.colors()?.driverColors?.[driver] ?? 'black',
        ],
      ]);
    }

    return new Map<string, [number, string]>(
      gaps.sort((a, b) => a[1][0] - b[1][0]).slice(0, 10),
    );
  });

  protected readonly laps = computed(() => {
    const laps: number[] = [];

    for (const driver of this.drivers() ?? []) {
      laps.push(this.gapData()?.[driver]?.gaps.length ?? 0);
    }

    return Math.max(...laps);
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
      this.gapData.set(undefined);

      this.backendService
        .doGet<LeaderGapResponse>(
          `fast-f1/leader-gap?year=${selectedRace.year}&round=${selectedRace.event?.roundNumber}&session=Race`,
        )
        .pipe(first((response) => !!response))
        .subscribe({
          next: (gapData) => {
            this.gapData.set(gapData.payload);
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
        text: 'Gap to Leader After Checkered Flag',
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
        data: Array.from(this.gaps().keys()),
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
      series: [this.createSeries()],
    };
  }

  /**
   * Creates the series for each driver
   * @private
   */
  private createSeries() {
    return {
      type: 'bar',
      data: Array.from(this.gaps().values()).map(([diff, color]) => ({
        value: diff,
        itemStyle: {
          color: color,
        },
      })),
    };
  }
}
