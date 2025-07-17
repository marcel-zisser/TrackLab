import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxEchartsDirective } from 'ngx-echarts';
import { BackendService, ThemeService } from '@tracklab/services';
import {
  Event,
  SelectionOption,
  StrategyResponse,
  TireColors,
  TireCompound,
} from '@tracklab/models';
import { DropdownModule } from 'primeng/dropdown';
import { AnalysisBaseComponent } from '../analysis-base/analysis-base.component';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
  selector: 'tl-strategy-comparison',
  imports: [
    AnalysisBaseComponent,
    FormsModule,
    NgxEchartsDirective,
    DropdownModule,
    FloatLabel,
  ],
  templateUrl: './strategy-comparison.component.html',
  styleUrl: './strategy-comparison.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StrategyComparisonComponent {
  private readonly themeService = inject(ThemeService);
  private readonly backendService = inject(BackendService);

  protected readonly years: SelectionOption<number, number>[] = Array.from(
    { length: new Date().getFullYear() - 2018 + 1 },
    (_, i) => 2018 + i
  ).map((year) => ({ label: year, value: year }));

  protected readonly races = computed<SelectionOption<string, Event>[]>(
    () =>
      this.raceResource
        ?.value()
        ?.map((race) => ({ label: race.name, value: race })) ?? []
  );

  protected readonly sessions = computed<SelectionOption<string, string>[]>(
    () =>
      this.race()?.sessionInfos.map((session) => ({
        label: session.name,
        value: session.name,
      })) ?? []
  );

  protected year = signal<string | undefined>(undefined);

  protected race = signal<Event | undefined>(undefined);
  protected session = signal<string | undefined>(undefined);
  protected readonly raceResource = this.backendService.doGetResource<Event[]>(
    `fast-f1/event-schedule?year=${this.year()}`
  );

  protected strategyDataResource =
    this.backendService.doGetResource<StrategyResponse>(
      `fast-f1/strategy?year=${this.year}&round=${
        this.race()?.roundNumber
      }&session=${this.session()}`
    );

  protected strategyData = this.strategyDataResource?.value;

  protected drivers = computed(() => {
    if (this.strategyData) {
      const drivers = new Set<string>();
      this.strategyData()?.strategy?.forEach((strategy) =>
        drivers.add(strategy.driver)
      );
      return drivers;
    }
    return undefined;
  });

  protected processedData = computed(() => {
    if (!this.strategyData) {
      return undefined;
    }

    const processedData: any[] = [];
    const driverStintSums = new Map<string, number>();

    this.strategyData()?.strategy.forEach((strategy) => {
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
  });

  protected readonly chartTheme = this.themeService.chartTheme;

  chartOptions = computed(() => ({
    title: {
      text: 'Strategy Comparison',
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
  }));
}
