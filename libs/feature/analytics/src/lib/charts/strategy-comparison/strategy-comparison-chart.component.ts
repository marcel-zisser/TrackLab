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
  EventData,
  RaceSelection,
  Strategy,
  StrategyResponse,
} from '@tracklab/models';
import { first } from 'rxjs';
import { AnalyticsStore } from '../../store';
import { EChartsCoreOption } from 'echarts';
import { BaseChart, ChartBaseComponent } from '@tracklab/shared/components';

@Component({
  selector: 'tl-strategy-comparison-chart',
  imports: [ChartBaseComponent],
  providers: [
    { provide: BaseChart, useExisting: StrategyComparisonChartComponent },
  ],
  templateUrl: './strategy-comparison-chart.component.html',
  styleUrl: './strategy-comparison-chart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StrategyComparisonChartComponent extends BaseChart {
  raceSelection = input.required<RaceSelection | undefined>();
  chart = viewChild.required<ChartBaseComponent>('chartBase');

  private readonly backendService = inject(BackendService);
  private readonly store = inject(AnalyticsStore);

  protected selectedYear: string | undefined;
  protected selectedEvent: EventData | undefined;
  protected selectedSession: string | undefined;

  protected readonly strategyData = signal<Strategy[] | undefined>(undefined);
  protected readonly processedData = computed(() =>
    this.processData(this.strategyData()),
  );

  protected drivers = computed(() => {
    const strategyData = this.strategyData();
    if (strategyData) {
      const drivers = new Set<string>();
      strategyData.forEach((strategy) => drivers.add(strategy.driver));
      return drivers;
    }
    return undefined;
  });
  protected lapAmount = computed(() => {
    const data = this.strategyData() ?? [];
    let lapAmount = 0;

    const driverStintSums = new Map<string, number>();

    data.forEach((strategy) => {
      const key = strategy.driver;
      const startLap = driverStintSums.get(key) || 0;
      const endLap = startLap + strategy.stintLength;
      driverStintSums.set(key, endLap);
      lapAmount = lapAmount < endLap ? endLap : lapAmount;
    });

    return lapAmount;
  });

  readonly chartOptions = linkedSignal<EChartsCoreOption>(() =>
    this.createChartOptions(),
  );

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
   * Effect to load the strategy data, once all inputs have been selected
   * @protected
   */
  protected loadData(selectedRace: RaceSelection) {
    this.selectedYear = selectedRace.year;
    this.selectedEvent = selectedRace.event;
    this.selectedSession = selectedRace.session;

    if (selectedRace.year && selectedRace.event && selectedRace.session) {
      this.strategyData.set(undefined);
      this.backendService
        .doGet<StrategyResponse>(
          `analytics/strategy?year=${selectedRace.year}&round=${selectedRace.event?.roundNumber}&session=${selectedRace.session}`,
        )
        .pipe(first((response) => !!response))
        .subscribe({
          next: (response) => this.strategyData.set(response.strategy),
        });
    }
  }

  /**
   * Processes the strategy data retrieved from the backend
   * @private
   */
  private processData(data: Strategy[] | undefined) {
    if (!data) {
      return undefined;
    }

    const processedData: any[] = [];
    const driverStintSums = new Map<string, number>();

    data.forEach((strategy) => {
      const key = strategy.driver;
      const startLap = driverStintSums.get(key) || 0;
      processedData.push([
        key,
        startLap,
        strategy.stintLength,
        strategy.compound,
        this.store.colors()?.compoundColors[strategy.compound],
      ]);
      const endLap = startLap + strategy.stintLength;
      driverStintSums.set(key, endLap);
    });

    return processedData;
  }

  /**
   * Create the options for the strategy comparison chart
   * @private
   */
  private createChartOptions(): EChartsCoreOption {
    return {
      title: {
        text: `Strategy Comparison ${this.selectedEvent?.name ?? ''} ${this.selectedYear ?? ''}`,
        left: 'center',
      },
      tooltip: {
        formatter: (p: any) => {
          const [driver, startLap, length, compound] = p.data;
          return `<strong>${driver}</strong><br/>${compound} <br/>${length} Laps<br/>Lap ${startLap} → ${
            startLap + length
          }`;
        },
      },
      legend: {
        data: [...Object.keys(this.store.colors()?.compoundColors ?? {})],
      },
      grid: {
        left: 50,
        right: 50,
        bottom: 50,
        top: 50,
      },
      xAxis: {
        type: 'value',
        name: 'Laps',
        max: this.lapAmount(),
      },
      yAxis: {
        type: 'category',
        data: Array.from(this.drivers()?.values() ?? []),
      },
      series: [
        {
          type: 'custom',
          renderItem: function (params: any, api: any) {
            const driverIndex = api.value(0);
            const start = api.value(1);
            const length = api.value(2);
            const color = api.value(4);
            const end = start + length;

            const y = api.coord([0, driverIndex])[1];
            const xStart = api.coord([start, 0])[0];
            const xEnd = api.coord([end, 0])[0];

            return {
              type: 'rect',
              shape: {
                x: xStart,
                y: y - 10,
                width: xEnd - xStart,
                height: 20,
              },
              style: {
                fill: color,
                stroke: '#777',
                lineWidth: 1.5,
              },
            };
          },
          encode: {
            x: [1, 2],
            y: 0,
          },
          data: this.processedData(),
        },
      ],
    };
  }
}
