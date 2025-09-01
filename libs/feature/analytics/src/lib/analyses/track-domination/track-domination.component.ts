import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { BackendService } from '@tracklab/services';
import {
  Driver,
  Event,
  PositionTelemetry,
  RaceSelection,
  TrackDominationResponse,
} from '@tracklab/models';
import {
  AnalysisBaseComponent,
  SourceSelectionComponent,
} from '../../analysis-base';
import { first } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ChartBaseComponent } from '../../analysis-base/chart-base/chart-base.component';

@Component({
  selector: 'tl-track-domination',
  imports: [
    AnalysisBaseComponent,
    SourceSelectionComponent,
    FormsModule,
    ChartBaseComponent,
  ],
  templateUrl: './track-domination.component.html',
  styleUrl: './track-domination.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackDominationComponent {
  private readonly backendService = inject(BackendService);

  protected selectedYear: string | undefined;
  protected selectedEvent: Event | undefined;
  protected selectedSession: string | undefined;

  protected readonly coordinates = signal<PositionTelemetry[] | undefined>(
    undefined,
  );
  protected readonly domination = signal<string[] | undefined>(undefined);
  protected readonly selectedDrivers = signal<Driver[]>([]);

  protected readonly chartOptions = computed(() => this.createChartOptions());

  /**
   * Effect to load the pace data, once all inputs have been selected
   * @protected
   */
  protected loadTrackDomination(selectedRace: RaceSelection) {
    if (
      selectedRace.year &&
      selectedRace.event &&
      selectedRace.session &&
      selectedRace.drivers?.length === 2
    ) {
      this.selectedYear = selectedRace.year;
      this.selectedEvent = selectedRace.event;
      this.selectedSession = selectedRace.session;

      this.coordinates.set(undefined);
      this.domination.set(undefined);

      this.backendService
        .doGet<TrackDominationResponse>(
          `fast-f1/track-domination?` +
            `year=${selectedRace.year}&round=${selectedRace.event?.roundNumber}&` +
            `session=${selectedRace.session}&` +
            `drivers=${selectedRace.drivers[0]}&drivers=${selectedRace.drivers[1]}`,
        )
        .pipe(first((response) => !!response))
        .subscribe({
          next: (response) => {
            this.coordinates.set(response?.coordinates ?? []);
            this.domination.set(response?.domination ?? []);
            this.selectedDrivers.set(response?.drivers ?? []);
          },
        });
    }
  }

  /**
   * Create the options for the strategy comparison chart
   * @private
   */
  private createChartOptions() {
    return {
      title: {
        text:
          `Track Domination ${this.selectedDrivers()[0].givenName} ${this.selectedDrivers()[0].familyName}` +
          ` vs. ${this.selectedDrivers()[1].givenName} ${this.selectedDrivers()[1].familyName}`,
        left: 'center',
      },
      grid: {
        left: 50,
        containLabel: true,
      },
      yAxis: {
        type: 'value',
        name: 'y',
      },
      xAxis: {
        type: 'value',
        name: 'x',
      },
      legend: {
        show: true,
        data: [...this.createLegendData()],
      },
      series: [...this.createGearShiftData()],
    };
  }

  private createGearShiftData() {
    const segmentConfigs = [];
    const segments: [number, number, string][][] = [];
    const domination = this.domination();
    const coordinates = this.coordinates();

    if (
      !coordinates ||
      !domination ||
      coordinates.length !== domination.length
    ) {
      return [];
    }

    const positionData = coordinates.map((position, idx) => {
      const positionData: [number, number, string] = [
        position.x,
        position.y,
        domination[idx],
      ];
      return positionData;
    });

    while (positionData.length) {
      const driver = domination[0];
      const changeIndex = domination.findIndex((data) => data !== driver);
      if (changeIndex === -1) {
        segments.push(positionData.splice(0, positionData.length));
        domination.splice(0, positionData.length);
      } else {
        segments.push(positionData.splice(0, changeIndex));
        domination.splice(0, changeIndex);
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
        name: segments[segmentIdx][0][2],
        data: segments[segmentIdx] ?? [],
        encode: {
          x: 0,
          y: 1,
        },
        lineStyle: {
          ...this.getLineStyle(segments[segmentIdx][0][2]),
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

  /**
   * Gets the line style for a given driver
   * @param driverCode the code of the driver
   * @private
   */
  private getLineStyle(driverCode: string) {
    const driver = this.selectedDrivers().find(
      (driver) => driver.code === driverCode,
    );

    if (!driver) {
      return undefined;
    }

    return {
      color: driver.color,
      type: driver.lineStyle,
    };
  }

  private createLegendData() {
    return this.selectedDrivers().map((driver) => {
      if (driver.lineStyle === 'solid') {
        return {
          name: driver.code,
          icon: 'path://M0,3 h6 v1 h-6 Z',
          itemStyle: { color: driver.color },
        };
      } else {
        return {
          name: driver.code,
          icon: 'path://M0,3 h1 v1 h-1 Z M2,3 h1 v1 h-1 Z M4,3 h1 v1 h-1 Z M6,3 h1 v1 h-1 Z',
          itemStyle: { color: driver.color },
        };
      }
    });
  }
}
