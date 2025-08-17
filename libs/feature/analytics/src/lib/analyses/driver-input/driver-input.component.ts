import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { BackendService, ThemeService } from '@tracklab/services';
import {
  CarTelemetry,
  CarTelemetryResponse,
  CircuitInformation,
  Event,
  RaceSelection,
} from '@tracklab/models';
import {
  AnalysisBaseComponent,
  SourceSelectionComponent,
} from '../../analysis-base';
import { combineLatest, first } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ECharts } from 'echarts/core';
import { SourceSelectionService } from '../../analysis-base/source-selection/source-selection.service';
import { ChartBaseComponent } from '../../analysis-base/chart-base/chart-base.component';

@Component({
  selector: 'tl-driver-input',
  imports: [
    AnalysisBaseComponent,
    SourceSelectionComponent,
    FormsModule,
    ChartBaseComponent,
  ],
  templateUrl: './driver-input.component.html',
  styleUrl: './driver-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverInputComponent {
  private readonly themeService = inject(ThemeService);
  private readonly backendService = inject(BackendService);
  private readonly sourceSelectionService = inject(SourceSelectionService);

  protected selectedYear: string | undefined;
  protected selectedEvent: Event | undefined;
  protected selectedSession: string | undefined;

  protected readonly chartTheme = this.themeService.chartTheme;
  protected readonly carTelemetries = signal<CarTelemetry[] | undefined>(
    undefined,
  );
  protected readonly circuitInfo = signal<CircuitInformation | undefined>(
    undefined,
  );

  protected readonly processedData = computed<
    Map<string, CarTelemetry[]> | undefined
  >(() => this.processData(this.carTelemetries()));
  protected drivers = computed(() =>
    Array.from(this.processedData()?.keys() ?? []),
  );

  protected readonly driverOne = signal<string | undefined>(undefined);
  protected readonly driverTwo = signal<string | undefined>(undefined);

  protected readonly chartOptions = computed(() => this.createChartOptions());

  protected onChartInit(ec: ECharts) {
    this.sourceSelectionService.setChartInstance(ec);
  }

  /**
   * Effect to load the pace data, once all inputs have been selected
   * @protected
   */
  protected loadCarTelemetry(selectedRace: RaceSelection) {
    if (selectedRace.year && selectedRace.event && selectedRace.session) {
      this.selectedYear = selectedRace.year;
      this.selectedEvent = selectedRace.event;
      this.selectedSession = selectedRace.session;
      this.driverOne.set(selectedRace?.drivers?.[0]);
      this.driverTwo.set(selectedRace?.drivers?.[1]);

      this.carTelemetries.set(undefined);

      combineLatest([
        this.backendService.doGet<CarTelemetryResponse>(
          `fast-f1/car-telemetry?year=${selectedRace.year}&round=${selectedRace.event?.roundNumber}&session=${selectedRace.session}`,
        ),
        this.backendService.doGet<CircuitInformation>(
          `fast-f1/circuit-info?year=${selectedRace.year}&round=${selectedRace.event?.roundNumber}&session=${selectedRace.session}`,
        ),
      ])
        .pipe(first((response) => !!response))
        .subscribe({
          next: ([telemetries, circuitInfo]) => {
            this.carTelemetries.set(telemetries?.telemetries ?? []);
            this.circuitInfo.set(circuitInfo);
          },
        });
    }
  }

  /**
   * Processes the strategy data retrieved from the backend
   * @private
   */
  private processData(data: CarTelemetry[] | undefined) {
    if (!data) {
      return undefined;
    }

    const groupedTraces = new Map<string, CarTelemetry[]>();

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
        text: 'Driver Input Comparison',
        left: 'center',
      },
      grid: {
        left: 50,
        containLabel: true, // ensures labels aren't cut off
      },
      yAxis: {
        type: 'value',
        name: '%',
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
          {
            name: `${this.driverOne()}-Throttle`,
            icon: 'path://M0,3 h6 v1 h-6 Z',
            itemStyle: { color: 'green' },
          },
          {
            name: `${this.driverOne()}-Brake`,
            icon: 'path://M0,3 h6 v1 h-6 Z',
            itemStyle: { color: 'red' },
          },
          {
            name: `${this.driverTwo()}-Throttle`,
            icon: 'path://M0,3 h1 v1 h-1 Z M2,3 h1 v1 h-1 Z M4,3 h1 v1 h-1 Z M6,3 h1 v1 h-1 Z',
            itemStyle: { color: 'green' },
          },
          {
            name: `${this.driverTwo()}-Brake`,
            icon: 'path://M0,3 h1 v1 h-1 Z M2,3 h1 v1 h-1 Z M4,3 h1 v1 h-1 Z M6,3 h1 v1 h-1 Z',
            itemStyle: { color: 'red' },
          },
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
        this.createThrottleSeries(this.driverOne() ?? '', 'solid'),
        this.createBrakeSeries(this.driverOne() ?? '', 'solid'),
        this.createThrottleSeries(this.driverTwo() ?? '', 'dotted'),
        this.createBrakeSeries(this.driverTwo() ?? '', 'dotted'),
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

  private createThrottleSeries(driver: string, lineType: string) {
    return {
      type: 'line',
      name: `${driver}-Throttle`,
      data:
        this.processedData()
          ?.get(driver)
          ?.map((telemetry) => [telemetry.distance, telemetry.throttle]) ?? [],
      smooth: true,
      symbol: 'none',
      lineStyle: {
        color: 'green',
        type: lineType,
      },
    };
  }

  private createBrakeSeries(driver: string, lineType: string) {
    return {
      type: 'line',
      name: `${driver}-Brake`,
      data:
        this.processedData()
          ?.get(driver)
          ?.map((telemetry) => [
            telemetry.distance,
            telemetry.brake ? 100 : 0,
          ]) ?? [],
      smooth: true,
      symbol: 'none',

      lineStyle: {
        color: 'red',
        type: lineType,
      },
    };
  }
}
