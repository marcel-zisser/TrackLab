import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { BackendService } from '@tracklab/services';
import { Event, Lap, LapsResponse, RaceSelection } from '@tracklab/models';
import {
  AnalysisBaseComponent,
  SourceSelectionComponent,
} from '../../analysis-base';
import { first } from 'rxjs';
import * as echarts from 'echarts/core';
import 'echarts/extension/dataTool';
import { ChartBaseComponent } from '../../analysis-base/chart-base/chart-base.component';
import {
  convertToMilliseconds,
  millisecondsToTimingString,
} from '@tracklab/util';

const prepareBoxplotData = (echarts as any).dataTool.prepareBoxplotData;

@Component({
  selector: 'tl-team-pace',
  imports: [
    AnalysisBaseComponent,
    SourceSelectionComponent,
    ChartBaseComponent,
  ],
  templateUrl: './team-pace-comparison.component.html',
  styleUrl: './team-pace-comparison.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamPaceComparisonComponent {
  private readonly backendService = inject(BackendService);

  protected selectedYear: string | undefined;
  protected selectedEvent: Event | undefined;

  protected readonly paceData = signal<Lap[] | undefined>(undefined);
  protected readonly processedData = computed(() =>
    this.processData(this.paceData()),
  );
  protected teams = computed(() =>
    Array.from(this.processedData()?.keys() ?? []),
  );
  protected readonly boxplotData = computed(() => {
    const boxplotData = prepareBoxplotData(
      this.teams().map(
        (team) => this.processedData()?.get(team)?.lapTimes ?? [],
      ),
      {},
    );
    boxplotData.boxData = boxplotData.boxData?.map((item: any, i: any) => ({
      value: item,
      itemStyle: {
        color: this.processedData()?.get(this.teams()?.[i])?.color ?? '#000',
        borderColor: '#777',
      },
    }));

    return boxplotData;
  });

  protected yAxisMin = computed(() => {
    const minBox: number[] = this.boxplotData().boxData.map(
      (box: any) => box.value[0],
    );
    const outliers: number[] = this.boxplotData().outliers.map(
      (outlier: any) => outlier[1],
    );
    return Math.min(...minBox, ...outliers) - 1000;
  });
  protected readonly chartOptions = computed(() => this.createChartOptions());

  /**
   * Effect to load the team pace data
   * @protected
   */
  protected loadPaceData(selectedRace: RaceSelection) {
    if (selectedRace.year && selectedRace.event) {
      this.selectedYear = selectedRace.year;
      this.selectedEvent = selectedRace.event;

      this.paceData.set(undefined);
      this.backendService
        .doGet<LapsResponse>(
          `fast-f1/quick-laps?year=${selectedRace.year}&round=${selectedRace.event?.roundNumber}`,
        )
        .pipe(first((response) => !!response))
        .subscribe({
          next: (response) => this.paceData.set(response.laps),
        });
    }
  }

  /**
   * Processes the team pace data retrieved from the backend
   * @private
   */
  private processData(data: Lap[] | undefined) {
    if (!data) {
      return undefined;
    }

    const groupedLaps = new Map<
      string,
      { color: string; lapTimes: number[] }
    >();

    data.forEach((lap) => {
      if (!groupedLaps.has(lap.team)) {
        groupedLaps.set(lap.team, { color: lap.teamColor, lapTimes: [] });
      }
      groupedLaps
        .get(lap.team)
        ?.lapTimes.push(convertToMilliseconds(lap.lapTime));
    });

    return groupedLaps;
  }

  /**
   * Create the options for the team pace comparison chart
   * @private
   */
  private createChartOptions() {
    return {
      title: {
        text: 'Lap Time Distribution by Team',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.value.length === 6) {
            return `<b>Min</b>: ${millisecondsToTimingString(params.value[1])}<br/>
                    <b>Q1</b>: ${millisecondsToTimingString(params.value[2])}<br/>
                    <b>Median</b>:: ${millisecondsToTimingString(params.value[3])}<br/>
                    <b>Q3</b>:: ${millisecondsToTimingString(params.value[4])}<br/>
                    <b>Max</b>:: ${millisecondsToTimingString(params.value[5])}`;
          } else {
            return `Lap: ${millisecondsToTimingString(params.value[1])}`;
          }
        },
      },
      xAxis: {
        type: 'category',
        data: this.teams(),
        axisLabel: { rotate: 20 },
      },
      yAxis: {
        type: 'value',
        name: 'Lap Time',
        min: this.yAxisMin(),
        axisLabel: {
          formatter: (val: number) => millisecondsToTimingString(val),
        },
      },
      series: [
        {
          type: 'boxplot',
          data: this.boxplotData().boxData,
        },
        {
          name: 'Outliers',
          type: 'scatter',
          data: this.boxplotData().outliers,
        },
      ],
    };
  }
}
