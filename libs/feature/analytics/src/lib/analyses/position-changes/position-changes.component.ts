import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { BackendService, ThemeService } from '@tracklab/services';
import {
  DriverPositionPayload,
  DriverPositionResponse,
  Event,
  RaceSelection,
} from '@tracklab/models';
import {
  AnalysisBaseComponent,
  SourceSelectionComponent,
} from '../../analysis-base';
import { first } from 'rxjs';
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
  templateUrl: './position-changes.component.html',
  styleUrl: './position-changes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PositionChangesComponent {
  private readonly themeService = inject(ThemeService);
  private readonly backendService = inject(BackendService);

  protected selectedYear: string | undefined;
  protected selectedEvent: Event | undefined;

  protected readonly chartTheme = this.themeService.chartTheme;
  protected readonly drivers = signal<string[] | undefined>(undefined);
  protected readonly positionData = signal<DriverPositionPayload | undefined>(
    undefined,
  );
  protected readonly laps = computed(() => {
    const laps: number[] = [];

    for (const driver of this.drivers() ?? []) {
      laps.push(this.positionData()?.[driver]?.positions.length ?? 0);
    }

    return Math.max(...laps);
  });

  protected readonly chartOptions = computed(() => this.createChartOptions());

  /**
   * Effect to load the pace data, once all inputs have been selected
   * @protected
   */
  protected loadPositionData(selectedRace: RaceSelection) {
    if (selectedRace.year && selectedRace.event) {
      this.selectedYear = selectedRace.year;
      this.selectedEvent = selectedRace.event;

      this.positionData.set(undefined);

      this.backendService
        .doGet<DriverPositionResponse>(
          `fast-f1/position-data?year=${selectedRace.year}&round=${selectedRace.event?.roundNumber}`,
        )
        .pipe(first((response) => !!response))
        .subscribe({
          next: (positionData) => {
            this.drivers.set(Object.keys(positionData.payload));
            this.positionData.set(positionData.payload);
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
        text: 'Driver Positions Over Race Distance',
        left: 'center',
      },
      grid: {
        left: 50,
        containLabel: true, // ensures labels aren't cut off
      },
      yAxis: {
        type: 'value',
        name: 'Position',
        inverse: true,
        interval: 1,
        startValue: 1,
        max: this.drivers()?.length,
      },
      xAxis: {
        type: 'value',
        name: 'Lap',
        max: this.laps(),
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        order: 'valueAsc',
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        top: 'center',
        right: 0,
        scroll: true,
        data: [...this.createDriverLegend()],
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

  private createDriverSeries() {
    return (
      this.drivers()?.map((driver) => ({
        type: 'line',
        name: driver,
        data:
          this.positionData()?.[driver].positions?.map((position, index) => [
            index,
            position,
          ]) ?? [],
        showSymbol: false,
        lineStyle: {
          color: this.positionData()?.[driver].color,
          type: this.positionData()?.[driver].lineStyle,
        },
        itemStyle: {
          color: this.positionData()?.[driver].color,
        },
      })) ?? []
    );
  }

  private createDriverLegend() {
    return (
      this.drivers()?.map((driver) => {
        const legend = {
          name: driver,
          icon: '',
          itemStyle: {
            color: this.positionData()?.[driver]?.color,
          },
        };

        if (this.positionData()?.[driver]?.lineStyle === 'solid') {
          legend.icon = 'path://M0,3 h6 v1 h-6 Z';
        } else {
          legend.icon =
            'path://M0,3 h2 v1 h-2 Z M3,3 h2 v1 h-2 Z M6,3 h2 v1 h-2 Z';
        }

        return legend;
      }) ?? []
    );
  }
}
