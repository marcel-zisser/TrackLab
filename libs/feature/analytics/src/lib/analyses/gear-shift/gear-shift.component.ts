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
import { ChartBaseComponent } from '../../analysis-base/chart-base/chart-base.component';

@Component({
  selector: 'tl-gear-shift',
  imports: [
    AnalysisBaseComponent,
    SourceSelectionComponent,
    FormsModule,
    ChartBaseComponent,
  ],
  templateUrl: './gear-shift.component.html',
  styleUrl: './gear-shift.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GearShiftComponent {
  private readonly themeService = inject(ThemeService);
  private readonly backendService = inject(BackendService);

  protected selectedYear: string | undefined;
  protected selectedEvent: Event | undefined;
  protected selectedSession: string | undefined;

  protected readonly chartTheme = this.themeService.chartTheme;
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
    if (
      selectedRace.year &&
      selectedRace.event &&
      selectedRace.session &&
      selectedRace.drivers
    ) {
      this.selectedYear = selectedRace.year;
      this.selectedEvent = selectedRace.event;
      this.selectedSession = selectedRace.session;
      this.selectedDriver.set(selectedRace.drivers[0] ?? undefined);

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
    return {
      title: {
        text: 'Gear Changes over Fastest Lap',
        left: 'center',
      },
      grid: {
        left: 50,
        containLabel: true, // ensures labels aren't cut off
      },
      yAxis: {
        type: 'value',
        name: 'y',
      },
      xAxis: {
        type: 'value',
        name: 'x',
      },
      visualMap: {
        top: 'center',
        pieces: [
          { value: 1, color: this.mapGearToColor(1) },
          { value: 2, color: this.mapGearToColor(2) },
          { value: 3, color: this.mapGearToColor(3) },
          { value: 4, color: this.mapGearToColor(4) },
          { value: 5, color: this.mapGearToColor(5) },
          { value: 6, color: this.mapGearToColor(6) },
          { value: 7, color: this.mapGearToColor(7) },
          { value: 8, color: this.mapGearToColor(8) },
        ],
      },
      series: [...this.createGearShiftData()],
    };
  }

  private createGearShiftData() {
    const segmentConfigs = [];
    const segments: number[][][] = [];
    const positionData = this.processedData()
      ?.get(this.selectedDriver() ?? '')
      ?.map((telemetry) => [
        (telemetry?.position?.x ?? 0) / 10,
        (telemetry?.position?.y ?? 0) / 10,
        telemetry?.nGear ?? 0,
      ]);

    if (!positionData) {
      return [];
    }

    while (positionData.length) {
      const changeIndex = positionData.findIndex(
        (data) => data[2] !== positionData[0][2],
      );
      if (changeIndex === -1) {
        segments.push(positionData.splice(0, positionData.length));
      } else {
        segments.push(positionData.splice(0, changeIndex));
      }
    }

    for (let segmentIdx = 0; segmentIdx < segments.length; segmentIdx++) {
      if (segmentIdx !== segments.length - 1) {
        segments[segmentIdx].push(segments[segmentIdx + 1][0]);
      } else {
        segments[segmentIdx].push(segments[0][0]);
      }
      segmentConfigs.push({
        type: 'line',
        name: this.selectedDriver(),
        data: segments[segmentIdx] ?? [],
        encode: {
          x: 0,
          y: 1,
        },
        lineStyle: {
          color: this.mapGearToColor(segments[segmentIdx][0][2]),
          width: 5,
        },
        emphasis: {
          focus: 'series',
          lineStyle: {
            width: 6,
          },
        },
        smooth: true,
        symbol: 'none',
      });
    }

    return segmentConfigs;
  }

  private mapGearToColor(gear: number) {
    switch (gear) {
      case 1:
        return '#8800ff';
      case 2:
        return '#0000ff';
      case 3:
        return '#009dff';
      case 4:
        return '#00ffcc';
      case 5:
        return '#00ff00';
      case 6:
        return '#ffbd00';
      case 7:
        return '#ff6d00';
      case 8:
        return '#ff0000';
      default:
        return 'grey';
    }
  }
}
