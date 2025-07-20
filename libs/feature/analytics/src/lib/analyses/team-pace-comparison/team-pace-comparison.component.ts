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
  Lap,
  QuickLapsResponse,
  RaceSelection,
  TireColors,
  TireCompound,
} from '@tracklab/models';
import {
  AnalysisBaseComponent,
  SourceSelectionComponent,
} from '../../analysis-base';
import { first } from 'rxjs';

@Component({
  selector: 'tl-team-pace-comparison',
  imports: [
    AnalysisBaseComponent,
    NgxEchartsDirective,
    SourceSelectionComponent,
  ],
  templateUrl: './team-pace-comparison.component.html',
  styleUrl: './team-pace-comparison.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamPaceComparisonComponent {
  private readonly themeService = inject(ThemeService);
  private readonly backendService = inject(BackendService);

  protected selectedYear: string | undefined;
  protected selectedEvent: Event | undefined;
  protected selectedSession: string | undefined;

  protected readonly chartTheme = this.themeService.chartTheme;
  protected readonly paceData = signal<Lap[] | undefined>(undefined);
  protected readonly processedData = computed(() =>
    this.processData(this.paceData()),
  );

  protected readonly chartOptions = computed(() => this.createChartOptions());
  protected teams = computed(() => {
    const paceData = this.paceData();
    if (paceData) {
      const teams = new Set<string>();
      paceData.forEach((strategy) => teams.add(strategy.team));
      return teams;
    }
    return undefined;
  });

  /**
   * Effect to load the pace data, once all inputs have been selected
   * @protected
   */
  protected loadPaceData(selectedRace: RaceSelection) {
    if (selectedRace.year && selectedRace.event && selectedRace.session) {
      this.selectedYear = selectedRace.year;
      this.selectedEvent = selectedRace.event;
      this.selectedSession = selectedRace.session;

      this.paceData.set(undefined);
      this.backendService
        .doGet<QuickLapsResponse>(
          `fast-f1/quick-laps?year=${selectedRace.year}&round=${selectedRace.event?.roundNumber}`,
        )
        .pipe(first((response) => !!response))
        .subscribe({
          next: (response) => this.paceData.set(response.laps),
        });
    }
  }

  /**
   * Processes the strategy data retrieved from the backend
   * @private
   */
  private processData(data: Lap[] | undefined) {
    if (!data) {
      return undefined;
    }

    const processedData: any[] = [];

    data.forEach((lap) => {
      const key = lap.team;
      processedData.push([key]);
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
        type: 'categories',
        name: 'Teams',
        data: Array.from(this.teams()?.values() ?? []),
      },
      yAxis: {
        type: 'value',
        name: 'Laptime',
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
