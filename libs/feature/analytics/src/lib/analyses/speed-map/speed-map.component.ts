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
  ChartDimensions,
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
import { SelectButton } from 'primeng/selectbutton';
import { ChartBaseComponent } from '../../analysis-base/chart-base/chart-base.component';

@Component({
  selector: 'tl-speed-map',
  imports: [
    AnalysisBaseComponent,
    SourceSelectionComponent,
    FormsModule,
    SelectButton,
    ChartBaseComponent,
  ],
  templateUrl: './speed-map.component.html',
  styleUrl: './speed-map.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeedMapComponent {
  private readonly themeService = inject(ThemeService);
  private readonly backendService = inject(BackendService);

  private readonly speedData = computed<number[]>(
    () =>
      this.processedData()
        ?.get(this.selectedDriver() ?? '')
        ?.map((telemetry) => telemetry?.speed ?? 0) ?? [],
  );
  private readonly minSpeed = computed<number>(() => {
    const speedData = this.speedData();
    if (speedData.length) {
      return Math.min(...speedData);
    }
    return 0;
  });
  private readonly maxSpeed = computed<number>(() => {
    const speedData = this.speedData();
    if (speedData.length) {
      return Math.max(...speedData);
    }
    return 350;
  });

  protected selectedYear: string | undefined;
  protected selectedEvent: Event | undefined;
  protected selectedSession: string | undefined;

  protected readonly chartTheme = this.themeService.chartTheme;
  protected readonly chartDimensionOptions = [
    { label: '2D', value: ChartDimensions.TwoDimensional },
    { label: '3D', value: ChartDimensions.ThreeDimensional },
  ];
  protected readonly chartDimension = signal<ChartDimensions>(
    ChartDimensions.TwoDimensional,
  );
  protected readonly telemetries = signal<CarTelemetry[] | undefined>(
    undefined,
  );
  protected readonly circuitInfo = signal<CircuitInformation | undefined>(
    undefined,
  );

  protected readonly processedData = computed<
    Map<string, CarTelemetry[]> | undefined
  >(() => this.processData(this.telemetries()));
  protected drivers = computed(() =>
    Array.from(this.processedData()?.keys() ?? []),
  );

  protected readonly selectedDriver = signal<string | undefined>(undefined);
  protected readonly chartOptions = computed(() => this.createChartOptions());

  /**
   * Effect to load the pace data, once all inputs have been selected
   * @protected
   */
  protected loadSpeedTraces(selectedRace: RaceSelection) {
    if (selectedRace.year && selectedRace.event && selectedRace.session) {
      this.selectedYear = selectedRace.year;
      this.selectedEvent = selectedRace.event;
      this.selectedSession = selectedRace.session;

      this.selectedDriver.set(undefined);
      this.telemetries.set(undefined);

      combineLatest([
        this.backendService.doGet<CarTelemetryResponse>(
          `fast-f1/car-telemetry?year=${selectedRace.year}&round=${selectedRace.event?.roundNumber}&session=${selectedRace.session}&withPosition=true`,
        ),
        this.backendService.doGet<CircuitInformation>(
          `fast-f1/circuit-info?year=${selectedRace.year}&round=${selectedRace.event?.roundNumber}&session=${selectedRace.session}`,
        ),
      ])
        .pipe(first((response) => !!response))
        .subscribe({
          next: ([telemetryResponse, circuitInfo]) => {
            this.telemetries.set(telemetryResponse?.telemetries ?? []);
            this.circuitInfo.set(circuitInfo);
            this.selectedDriver.set(selectedRace.drivers?.[0]);
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

    const groupedTelemetries = new Map<string, CarTelemetry[]>();

    data.forEach((telemetry) => {
      if (!groupedTelemetries.has(telemetry.driver)) {
        groupedTelemetries.set(telemetry.driver, []);
      }
      groupedTelemetries.get(telemetry.driver)?.push(telemetry);
    });

    return groupedTelemetries;
  }

  /**
   * Create the options for the strategy comparison chart
   * @private
   */
  private createChartOptions() {
    const chartOptions = {
      title: {
        text: 'Driver Speed over Fastest Lap',
        left: 'center',
      },
      visualMap: {
        show: true,
        top: 'center',
        left: 100,
        itemHeight: 300,
        itemWidth: 50,
        dimension: 2,
        calculable: true,
        min: this.minSpeed(),
        max: this.maxSpeed(),
        text: [this.maxSpeed(), this.minSpeed()],
        inRange: {
          color: [
            'indigo',
            'navy',
            'blue',
            'turquoise',
            'gold',
            'orange',
            'red',
            'fuchsia',
          ],
        },
      },
      xAxis3D: { type: 'value' },
      yAxis3D: { type: 'value' },
      zAxis3D: {
        type: 'value',
        name: '',
        show: false,
        axisLabel: {
          show: false,
        },
        min: 0,
      },
      grid3D: {
        splitLine: {
          show: false,
        },
        axisPointer: {
          show: false,
        },
        viewControl: {},
        boxHeight: 0,
      },
      series: [],
    };

    if (this.chartDimension() === ChartDimensions.TwoDimensional) {
      chartOptions.visualMap.dimension = 2;
      chartOptions.zAxis3D.show = false;
      chartOptions.zAxis3D.name = '';
      chartOptions.zAxis3D.axisLabel.show = false;
      chartOptions.grid3D.viewControl = {
        alpha: 90,
        beta: 0,
        rotateSensitivity: 0,
      };
      chartOptions.grid3D.boxHeight = 0;
      chartOptions.series = [this.createSpeedMapData2D()] as never;
    } else if (this.chartDimension() === ChartDimensions.ThreeDimensional) {
      chartOptions.visualMap.dimension = 3;
      chartOptions.zAxis3D.show = true;
      chartOptions.zAxis3D.name = 'Z';
      chartOptions.zAxis3D.axisLabel.show = true;
      chartOptions.grid3D.viewControl = {};
      chartOptions.grid3D.boxHeight = 100;
      chartOptions.series = [this.createSpeedMapData3D()] as never;
    }

    return chartOptions;
  }

  private createSpeedMapData2D() {
    const positionData =
      this.processedData()
        ?.get(this.selectedDriver() ?? '')
        ?.map((telemetry) => [
          (telemetry?.position?.x ?? 0) / 10,
          (telemetry?.position?.y ?? 0) / 10,
          telemetry?.speed ?? 0,
        ]) ?? [];

    if (positionData.length) {
      positionData.push(positionData[0]);
    }

    return {
      type: 'line3D',
      data: positionData,
      lineStyle: {
        width: 5,
      },
    };
  }

  private createSpeedMapData3D() {
    const positionData =
      this.processedData()
        ?.get(this.selectedDriver() ?? '')
        ?.map((telemetry) => [
          (telemetry?.position?.x ?? 0) / 10,
          (telemetry?.position?.y ?? 0) / 10,
          (telemetry?.position?.z ?? 0) / 10,
          telemetry?.speed ?? 0,
        ]) ?? [];

    if (positionData.length) {
      positionData.push(positionData[0]);
    }

    return {
      type: 'line3D',
      data: positionData,
      lineStyle: {
        width: 5,
      },
    };
  }
}
