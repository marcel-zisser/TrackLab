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
  EventData,
  LeaderGapPayload,
  LeaderGapResponse,
  RaceSelection,
} from '@tracklab/models';
import { first } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ChartBaseComponent } from '../../custom-analysis/analysis-base/chart-base/chart-base.component';
import {
  convertToMilliseconds,
  millisecondsToTimingString,
} from '@tracklab/util';
import { AnalyticsStore } from '../../store';

@Component({
  selector: 'tl-leader-gap-line-chart',
  imports: [FormsModule, ChartBaseComponent],
  templateUrl: './leader-gap-line-chart.component.html',
  styleUrl: './leader-gap-line-chart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaderGapLineChartComponent {
  raceSelection = input.required<RaceSelection | undefined>();

  private readonly backendService = inject(BackendService);
  private readonly store = inject(AnalyticsStore);

  protected selectedYear: string | undefined;
  protected selectedEvent: EventData | undefined;

  protected readonly gapData = signal<LeaderGapPayload | undefined>(undefined);

  protected readonly drivers = computed<string[]>(() =>
    Object.keys(this.gapData() ?? []),
  );

  protected readonly laps = computed(() => {
    const laps: number[] = [];

    for (const driver of this.drivers() ?? []) {
      laps.push(this.gapData()?.[driver]?.gaps.length ?? 0);
    }

    return Math.max(...laps);
  });

  protected readonly chartOptions = computed(() => this.createChartOptions());

  constructor() {
    effect(() => {
      const raceSelection = this.raceSelection();
      if (raceSelection) {
        this.loadGapData(raceSelection);
      }
    });
  }

  /**
   * Effect to load the position data for a given race
   * @protected
   */
  protected loadGapData(selectedRace: RaceSelection) {
    if (selectedRace.year && selectedRace.event) {
      this.selectedYear = selectedRace.year;
      this.selectedEvent = selectedRace.event;

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
        text: 'Gap to Leader Over Race Distance',
        left: 'center',
        top: 0,
      },
      grid: {
        left: 5,
        top: 40,
        bottom: 15,
        containLabel: true, // ensures labels aren't cut off
      },
      yAxis: {
        type: 'value',
        name: 'Time Difference',
        inverse: true,
        axisLabel: {
          formatter: (val: number) => millisecondsToTimingString(val),
        },
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
          this.gapData()?.[driver].gaps.map((gap, index) => [
            index,
            convertToMilliseconds(gap),
          ]) ?? [],
        showSymbol: false,
        lineStyle: {
          color: this.store.colors()?.driverColors?.[driver] ?? 'black',
          type: this.store.colors()?.driverStyles?.[driver] ?? 'solid',
          width: 2,
        },
        itemStyle: {
          color: this.store.colors()?.driverColors?.[driver] ?? 'black',
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
}
