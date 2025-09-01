import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { BackendService, ThemeService } from '@tracklab/services';
import { RaceSelection, WdcContendersPayload, WdcContendersResponse } from '@tracklab/models';
import { AnalysisBaseComponent, SourceSelectionComponent } from '../../analysis-base';
import { first } from 'rxjs';
import { ChartBaseComponent } from '../../analysis-base/chart-base/chart-base.component';

@Component({
  selector: 'tl-strategy-comparison',
  imports: [
    AnalysisBaseComponent,
    SourceSelectionComponent,
    ChartBaseComponent,
  ],
  templateUrl: './wdc-contenders.component.html',
  styleUrl: './wdc-contenders.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WdcContendersComponent {
  private readonly themeService = inject(ThemeService);
  private readonly backendService = inject(BackendService);

  protected selectedYear: string | undefined;

  protected readonly chartOptions = computed(() => this.createChartOptions());
  protected readonly processedData = computed(() =>
    this.processData(this.wdcContendersData()),
  );

  private readonly wdcContendersData = signal<WdcContendersPayload | undefined>(
    undefined,
  );

  private races = computed(() => {
    const data = this.wdcContendersData() ?? {};
    return Object.keys(data).sort(
      (raceA, raceB) => data[raceA].roundNumber - data[raceB].roundNumber,
    );
  });
  private drivers = computed(() => {
    const wdcContendersData = this.wdcContendersData() ?? {};
    const races = this.races();
    const drivers = new Set<string>();

    races.forEach((race) => {
      wdcContendersData[race].contenders.forEach((contender) =>
        drivers.add(contender.driver.code),
      );
    });

    const mostRecentRace = races[races.length - 1];
    return Array.from(drivers).sort(
      (a, b) =>
        (wdcContendersData[mostRecentRace].contenders.find(
          (contender) => contender.driver.code === a,
        )?.currentPoints ?? 0) -
        (wdcContendersData[mostRecentRace].contenders.find(
          (contender) => contender.driver.code === b,
        )?.currentPoints ?? 0),
    );
  });
  private maxDifference = 0;

  /**
   * Effect to load the strategy data, once all inputs have been selected
   * @protected
   */
  protected loadWdcContendersData(selectedRace: RaceSelection) {
    this.selectedYear = selectedRace.year;

    if (selectedRace.year) {
      this.wdcContendersData.set(undefined);
      this.backendService
        .doGet<WdcContendersResponse>(
          `fast-f1/wdc-contenders?year=${selectedRace.year}`,
        )
        .pipe(first((response) => !!response))
        .subscribe({
          next: (response) => this.wdcContendersData.set(response.payload),
        });
    }
  }

  /**
   * Processes the strategy data retrieved from the backend
   * @private
   */
  private processData(data: WdcContendersPayload | undefined) {
    if (!data) {
      return undefined;
    }
    const processedData: [string, string, number][] = [];
    const races = this.races();
    let maxDifference = 0;

    for (const race of races) {
      const contenders = data[race].contenders;
      const leaderPoints = Math.max(
        ...contenders.map((contender) => contender.currentPoints ?? 0),
      );

      contenders.forEach((contender) => {
        const difference = (contender.maxPoints ?? 0) - leaderPoints;

        if (difference > maxDifference) {
          maxDifference = difference;
        }

        processedData.push([race, contender.driver.code, difference]);
      });
    }

    this.maxDifference = maxDifference;
    return processedData;
  }

  /**
   * Create the options for the strategy comparison chart
   * @private
   */
  private createChartOptions() {
    return {
      title: {
        text: `World Driver Champion Contenders ${this.selectedYear ?? ''}`,
        left: 'center',
      },
      grid: {
        left: 50,
        right: 50,
        bottom: 50,
        top: 50,
      },
      xAxis: {
        type: 'category',
        name: 'Race',
        axisLabel: {
          interval: 0,
        },
      },
      yAxis: {
        type: 'category',
        name: 'Driver',
        data: this.drivers(),
      },
      tooltip: {
        show: true,
        formatter: (params: any) => {
          const [race, driver, diff] = params.value;
          // params contains info about the hovered item
          return `
            <strong>Points buffer vs. leader</strong><br/>
            <strong>Race: </strong>${race}<br/>
            <strong>Buffer: </strong>${diff}
          `;
        },
      },
      visualMap: [
        { show: false },
        ...this.generateVisualMaps(this.processedData() ?? []),
      ],
      series: [...this.generateSeries(this.processedData() ?? [])],
    };
  }

  private generateSeries(processedData: [string, string, number][]) {
    const series: any[] = [];

    this.races().forEach((race) => {
      const seriesData = processedData.filter((data) => data[0] === race);
      series.push({
        name: race,
        id: race,
        type: 'heatmap',
        data: seriesData,
      });
    });

    return series;
  }

  private generateVisualMaps(processedData: [string, string, number][]) {
    const visualMaps: any[] = [];

    this.races().forEach((race) => {
      const raceData = processedData.filter((data) => data[0] === race);
      const max = Math.max(...raceData.map((data) => data[2]));
      const min = Math.min(...raceData.map((data) => data[2]));

      visualMaps.push({
        type: 'continuous',
        show: false,
        unboundedRange: false,
        min: 0,
        max: max,
        dimension: 2,
        inRange: {
          color: max === 0 ? ['green'] : ['red', 'green'],
        },
        outOfRange: {
          color: ['black'],
        },
        seriesId: race,
      });
    });

    return visualMaps;
  }
}
