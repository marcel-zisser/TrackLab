import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { BackendService } from '@tracklab/services';
import {
  RaceSelection,
  WdcContendersPayload,
  WdcContendersResponse,
} from '@tracklab/models';
import { first } from 'rxjs';
import { BaseChart, ChartBaseComponent } from '@tracklab/shared/components';

@Component({
  selector: 'tl-wdc-contenders-chart',
  imports: [ChartBaseComponent],
  providers: [{ provide: BaseChart, useExisting: WdcContendersChartComponent }],
  templateUrl: './wdc-contenders-chart.component.html',
  styleUrl: './wdc-contenders-chart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WdcContendersChartComponent extends BaseChart {
  raceSelection = input.required<RaceSelection | undefined>();
  chart = viewChild.required<ChartBaseComponent>('chartBase');

  private readonly backendService = inject(BackendService);

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

  readonly chartOptions = linkedSignal(() => this.createChartOptions());

  constructor() {
    super();
    effect(() => {
      const selectedRace = this.raceSelection();

      if (selectedRace) {
        this.loadData(selectedRace);
      }
    });
  }

  /**
   * Loads the data for the WDC contenders
   * @protected
   */
  protected loadData(selectedRace: RaceSelection) {
    if (selectedRace.year) {
      this.wdcContendersData.set(undefined);
      let url = `fast-f1/wdc-contenders?year=${selectedRace.year}`;

      if (selectedRace.event) {
        url += `&round=${selectedRace.event?.roundNumber}`;
      }

      this.backendService
        .doGet<WdcContendersResponse>(url)
        .pipe(first((response) => !!response))
        .subscribe({
          next: (response) => this.wdcContendersData.set(response.payload),
        });
    }
  }

  /**
   * Processes the WDC contender data retrieved from the backend
   * @private
   */
  private processData(data: WdcContendersPayload | undefined) {
    if (!data) {
      return undefined;
    }
    const processedData: [string, string, number][] = [];
    const races = this.races();

    for (const race of races) {
      const contenders = data[race].contenders;
      const leaderPoints = Math.max(
        ...contenders.map((contender) => contender.currentPoints ?? 0),
      );

      contenders.forEach((contender) => {
        const difference = (contender.maxPoints ?? 0) - leaderPoints;

        processedData.push([race, contender.driver.code, difference]);
      });
    }

    return processedData;
  }

  /**
   * Create the options for the strategy comparison chart
   * @private
   */
  private createChartOptions() {
    return {
      title: {
        text: `World Driver Champion Contenders ${this.raceSelection()?.year}`,
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
          const [race, , diff] = params.value;
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

  /**
   * Generates the series config for the WDC contenders
   * @param processedData the processed data in the format [race, driver, buffer]
   * @private
   */
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

  /**
   * Generates the visual map based on the processed data
   * @param processedData the processed data in the format [race, driver, buffer]
   * @private
   */
  private generateVisualMaps(processedData: [string, string, number][]) {
    const visualMaps: any[] = [];

    this.races().forEach((race) => {
      const raceData = processedData.filter((data) => data[0] === race);
      const max = Math.max(...raceData.map((data) => data[2]));

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
