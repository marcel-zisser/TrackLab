import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { BackendService, ThemeService } from '@tracklab/services';
import {
  CircuitInformation,
  Event,
  RaceSelection,
  SpeedTrace,
  SpeedTracesResponse,
} from '@tracklab/models';
import {
  AnalysisBaseComponent,
  SourceSelectionComponent,
} from '../../analysis-base';
import { combineLatest, first } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ChartBaseComponent } from '../../analysis-base/chart-base/chart-base.component';

@Component({
  selector: 'tl-speed-traces',
  imports: [
    AnalysisBaseComponent,
    SourceSelectionComponent,
    FormsModule,
    ChartBaseComponent,
  ],
  templateUrl: './speed-traces.component.html',
  styleUrl: './speed-traces.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeedTracesComponent {
  private readonly themeService = inject(ThemeService);
  private readonly backendService = inject(BackendService);

  protected selectedYear: string | undefined;
  protected selectedEvent: Event | undefined;
  protected selectedSession: string | undefined;

  protected readonly chartTheme = this.themeService.chartTheme;
  protected readonly speedTraces = signal<SpeedTrace[] | undefined>(undefined);
  protected readonly circuitInfo = signal<CircuitInformation | undefined>(
    undefined,
  );

  protected readonly processedData = computed<
    Map<string, SpeedTrace[]> | undefined
  >(() => this.processData(this.speedTraces()));
  protected drivers = computed(() =>
    Array.from(this.processedData()?.keys() ?? []),
  );

  protected readonly selectedDrivers = signal<string[]>([]);

  protected readonly chartOptions = computed(() => this.createChartOptions());

  /**
   * Effect to load the pace data, once all inputs have been selected
   * @protected
   */
  protected loadSpeedTraces(selectedRace: RaceSelection) {
    if (
      selectedRace.year &&
      selectedRace.event &&
      selectedRace.session &&
      selectedRace.drivers
    ) {
      this.selectedYear = selectedRace.year;
      this.selectedEvent = selectedRace.event;
      this.selectedSession = selectedRace.session;
      this.selectedDrivers.set(selectedRace.drivers);

      this.speedTraces.set(undefined);

      combineLatest([
        this.backendService.doGet<SpeedTracesResponse>(
          `fast-f1/speed-traces?year=${selectedRace.year}&round=${selectedRace.event?.roundNumber}&session=${selectedRace.session}`,
        ),
        this.backendService.doGet<CircuitInformation>(
          `fast-f1/circuit-info?year=${selectedRace.year}&round=${selectedRace.event?.roundNumber}&session=${selectedRace.session}`,
        ),
      ])
        .pipe(first((response) => !!response))
        .subscribe({
          next: ([speedTraces, circuitInfo]) => {
            this.speedTraces.set(speedTraces?.speedTraces ?? []);
            this.circuitInfo.set(circuitInfo);
          },
        });
    }
  }

  /**
   * Processes the strategy data retrieved from the backend
   * @private
   */
  private processData(data: SpeedTrace[] | undefined) {
    if (!data) {
      return undefined;
    }

    const groupedTraces = new Map<string, SpeedTrace[]>();

    data.forEach((trace) => {
      if (!groupedTraces.has(trace.driver)) {
        groupedTraces.set(trace.driver, []);
      }
      groupedTraces.get(trace.driver)?.push(trace);
    });

    return groupedTraces;
  }

  /**
   * Create the options for the strategy comparison chart
   * @private
   */
  private createChartOptions() {
    return {
      title: {
        text: 'Driver Speed Traces over Fastest Lap',
        left: 'center',
      },
      grid: {
        left: 50,
        containLabel: true, // ensures labels aren't cut off
      },
      yAxis: {
        type: 'value',
        name: 'km/h',
        data: this.drivers(),
      },
      xAxis: {
        type: 'value',
        name: 'Distance in m',
        max: () => {
          const max = Math.max(
            ...Array.from(this.processedData()?.values() ?? [])
              .flat()
              .map((trace) => trace.distance),
          );
          return max + (max % 100);
        },
      },
      legend: {
        data: [
          {
            name: 'Corners',
            icon: 'path://M0,3 h2 v1 h-2 Z M3,3 h2 v1 h-2 Z M6,3 h2 v1 h-2 Z',
            itemStyle: { color: 'grey' },
          },
          ...(this.selectedDrivers() ?? []),
        ],
        type: 'scroll',
        orient: 'horizontal',
        bottom: 0,
        wrap: true,
        scroll: true,
      },
      dataZoom: [
        {
          type: 'inside',
          start: 100,
          end: 0,
        },
      ],
      series: [
        ...this.createDriverSeries(),
        {
          type: 'line',
          name: 'Corners',
          data: [[NaN, NaN]],
          showSymbol: false,
          markLine: {
            symbol: 'none',
            silent: true,
            data:
              this.circuitInfo()?.corners?.map((corner) => ({
                xAxis: corner.distance,
                name: `${corner.number}${corner.letter ?? ''}`,
              })) ?? [],
            label: {
              formatter: (params: any) => params.name,
              show: true,
              position: 'end',
            },
            lineStyle: {
              color: 'grey',
              type: 'dashed',
              width: 1,
            },
          },
        },
      ],
    };
  }

  private createDriverSeries() {
    return (
      this.selectedDrivers()?.map((driver) => ({
        type: 'line',
        name: driver,
        data:
          this.processedData()
            ?.get(driver)
            ?.map((trace) => [trace.distance, trace.speed]) ?? [],
        smooth: true,
        symbol: 'none',
      })) ?? []
    );
  }
}
