import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  viewChild,
} from '@angular/core';
import { ChartBaseComponent } from '@tracklab/components';
import { millisecondsToTimingString } from '@tracklab/util';
import { CopilotService } from '../../copilot.service';

@Component({
  selector: 'tl-track-evolution-chart',
  imports: [ChartBaseComponent],
  templateUrl: './track-evolution-chart.component.html',
  styleUrl: './track-evolution-chart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackEvolutionChartComponent {
  chart = viewChild.required<ChartBaseComponent>('chartBase');

  private readonly copilotService = inject(CopilotService);

  protected readonly trackEvolution = this.copilotService.trackEvolution;
  protected sessions = computed(() =>
    this.trackEvolution()?.evolution.map((sessionTime) => sessionTime.session),
  );
  protected times = computed(() =>
    this.trackEvolution()?.evolution.map((sessionTime) => sessionTime.time * 1000),
  );

  readonly chartOptions = linkedSignal(() => this.createChartOptions());

  /**
   * Create the options for the position change chart
   * @private
   */
  private createChartOptions() {
    return {
      title: {
        text: 'Track Evolution',
        left: 'center',
        top: 0,
      },
      grid: {
        show: true,
      },
      xAxis: {
        type: 'category',
        name: 'Session',
        data: this.sessions() ?? [],
      },
      yAxis: {
        type: 'value',
        name: 'Average Laptime',
        axisTick: {
          show: true,
        },
        min: function (value: any) {
          return value.min - 1000;
        },
        axisLabel: {
          show: true,
          formatter: (val: number) => millisecondsToTimingString(val),
        },
      },
      tooltip: {
        show: this.trackEvolution,
        valueFormatter: (val: number) => millisecondsToTimingString(val),
      },
      series: [this.createSeries()],
    };
  }

  /**
   * Creates the series for each driver
   * @private
   */
  private createSeries() {
    return {
      type: 'bar',
      data: this.times(),
      lineStyle: {
        width: 3
      },
      markPoint: {
        symbol: 'circle',
        symbolSize: 75
      }
    };
  }
}
