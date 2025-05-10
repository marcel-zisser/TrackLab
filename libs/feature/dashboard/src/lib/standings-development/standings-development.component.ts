import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input
} from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { DarkModeService, TeamColorMapper } from '@tracklab/services';
import { RaceResult } from '@tracklab/models';
import { EChartsType } from 'echarts/core';

@Component({
  selector: 'tl-standings-development',
  imports: [NgxEchartsDirective],
  templateUrl: './standings-development.component.html',
  styleUrl: './standings-development.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StandingsDevelopmentComponent {
  private readonly darkModeService = inject(DarkModeService);

  private chart: any | undefined;

  seasonData = input<RaceResult[] | undefined>();
  xAxisData = computed(() =>
    this.seasonData()?.map((race) => {
      const locality = race.circuit.location.locality;

      return race.type === 'race' ? locality : `${locality} Sprint`;
    })
  );

  seriesData = computed(() => {
    const data = new Map<string, [number[], string]>();

    this.seasonData()?.forEach((race) => {
      race.results.forEach((result) => {
        if (data.has(result.driver.code)) {
          const [points,] = data.get(result.driver.code) ?? [[], ''];
          points?.push(points[points.length - 1] + result.points);
        } else {
          data.set(result.driver.code, [[result.points], TeamColorMapper.mapTeamIdToColor(result.constructor.constructorId)]);
        }
      });
    });

    return data;
  });

  legendData = computed(() => Array.from(this.seriesData()?.keys()));

  protected readonly chartTheme = computed(() =>
    this.darkModeService.chartTheme() === 'dark' ? 'tracklab-dark' : ''
  );

  chartOptions = computed(() => ({
    tooltip: {
      trigger: 'axis',
      enterable: true,
      order: 'valueDesc',
      confine: false,
      className: 'tl-tooltip'
    },
    dataZoom: [
      {
        type: 'inside',
        start: 100,
        end: 0,
      },
    ],
    legend: {
      data: this.legendData(),
      type: 'plain',
      orient: 'horizontal',
      top: 0,
      padding: 10,
      wrap: true, // only if using latest ECharts
    },
    toolbox: {
      feature: {
        // saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: this.xAxisData(),
    },
    yAxis: {
      type: 'value',
    },
    series: Array.from(this.seriesData()?.entries()).map(([key, [value, color]]) => ({
      name: key,
      type: 'line',
      data: value,
      color: color,
    }))
  }));

  onChartInit(chart: EChartsType) {
    this.chart = chart;

    window.addEventListener('resize', () => {
      this.chart?.resize();
    });
  }
}
