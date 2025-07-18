import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { BackendService, ThemeService } from '@tracklab/services';
import {
  Event,
  RaceSelection,
  Strategy,
  StrategyResponse,
  TireColors,
  TireCompound,
} from '@tracklab/models';
import {
  AnalysisBaseComponent,
  SourceSelectionComponent,
} from '../../analysis-base';
import { first } from 'rxjs';

@Component({
  selector: 'tl-strategy-comparison',
  imports: [
    AnalysisBaseComponent,
    NgxEchartsDirective,
    SourceSelectionComponent,
  ],
  templateUrl: './strategy-comparison.component.html',
  styleUrl: './strategy-comparison.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StrategyComparisonComponent {
  private readonly themeService = inject(ThemeService);
  private readonly backendService = inject(BackendService);

  protected selectedYear: string | undefined;
  protected selectedEvent: Event | undefined;
  protected selectedSession: string | undefined;

  protected readonly chartTheme = this.themeService.chartTheme;
  protected readonly strategyData = signal<Strategy[] | undefined>(undefined);
  protected readonly processedData = computed(() =>
    this.processData(this.strategyData()),
  );

  protected readonly chartOptions = computed(() => this.createChartOptions());
  protected drivers = computed(() => {
    const strategyData = this.strategyData();
    if (strategyData) {
      const drivers = new Set<string>();
      strategyData.forEach((strategy) => drivers.add(strategy.driver));
      return drivers;
    }
    return undefined;
  });

  /**
   * Effect to load the strategy data, once all inputs have been selected
   * @protected
   */
  protected loadStrategyData(selectedRace: RaceSelection) {
    if (selectedRace.year && selectedRace.event && selectedRace.session) {
      this.selectedYear = selectedRace.year;
      this.selectedEvent = selectedRace.event;
      this.selectedSession = selectedRace.session;

      this.strategyData.set(undefined);
      this.backendService
        .doGet<StrategyResponse>(
          `fast-f1/strategy?year=${selectedRace.year}&round=${selectedRace.event?.roundNumber}&session=${selectedRace.session}`,
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
      ]);
      driverStintSums.set(key, startLap + strategy.stintLength);
    });

    return processedData;
  }

  /**
   * Create the options for the strategy comparison chart
   * @private
   */
  private createChartOptions() {
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
        data: ['SOFT', 'MEDIUM', 'HARD', TireCompound.Inter],
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
            const compound = api.value(3);
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
                fill: TireColors.get(compound),
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
