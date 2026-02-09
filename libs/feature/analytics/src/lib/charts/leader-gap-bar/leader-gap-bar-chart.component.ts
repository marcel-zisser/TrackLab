import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { BackendService } from '@tracklab/services';
import {
  LeaderGapPayload,
  LeaderGapResponse,
  EventSelection,
} from '@tracklab/models';
import { first } from 'rxjs';
import { FormsModule } from '@angular/forms';
import {
  convertToMilliseconds,
  millisecondsToTimingString,
} from '@tracklab/util';
import { TracklabStore } from '@tracklab/store';
import { BaseChart, ChartBaseComponent } from '@tracklab/components';

@Component({
  selector: 'tl-leader-gap-bar-chart',
  imports: [FormsModule, ChartBaseComponent],
  providers: [{ provide: BaseChart, useExisting: LeaderGapBarChartComponent }],
  templateUrl: './leader-gap-bar-chart.component.html',
  styleUrl: './leader-gap-bar-chart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaderGapBarChartComponent extends BaseChart {
  eventSelection = input.required<EventSelection | undefined>();
  chart = viewChild.required<ChartBaseComponent>('chartBase');

  private readonly backendService = inject(BackendService);
  private readonly store = inject(TracklabStore);

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

      if (laps.length < totalLaps - 2) {
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

    if (gaps.length === 0) {
      return undefined;
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
      const eventSelection = this.eventSelection();
      if (eventSelection) {
        this.loadData(eventSelection);
      }
    });
  }

  /**
   * Effect to load the position data for a given race
   * @protected
   */
  protected loadData(selectedRace: EventSelection) {
    if (selectedRace.year && selectedRace.event) {
      this.gapData.set(undefined);

      this.backendService
        .doGet<LeaderGapResponse>(
          `analytics/leader-gap?year=${selectedRace.year}&round=${selectedRace.event?.roundNumber}&session=Race`,
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
        data: Array.from(this.gaps()?.keys() ?? []),
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
      data: Array.from(this.gaps()?.values() ?? []).map(([diff, color]) => ({
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
}
