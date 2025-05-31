import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input
} from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { DarkModeService } from '@tracklab/services';
import { RaceResult } from '@tracklab/models';

@Component({
  selector: 'tl-standings-development',
  imports: [NgxEchartsDirective],
  templateUrl: './standings-development.component.html',
  styleUrl: './standings-development.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StandingsDevelopmentComponent {
  private readonly darkModeService = inject(DarkModeService);

  seasonData = input<RaceResult[] | undefined>();
  xAxisData = computed(() =>
    this.seasonData()?.map((race) => {
      const locality = race.location.locality;

      return race.type === 'Race' ? locality : `${locality} Sprint`;
    })
  );

  seriesData = computed(() => {
    const data = new Map<string, [number[], string]>();

    this.seasonData()?.forEach((race) => {
      race.results.forEach((result) => {
        if (data.has(result.driver.code)) {
          const [points,] = data.get(result.driver.code) ?? [[], ''];
          points?.push(points[points.length - 1] + result.points);
          data.set(result.driver.code, [
            points,
            result.team.color ?? 'black' ,
          ]);
        } else {
          data.set(result.driver.code, [
            [result.points],
            result.team.color ?? 'black' ,
          ]);
        }
      });
    });

    return data;
  });

  legendData = computed(() =>
   Array.from(this.seriesData()?.entries())
      .sort(([, [, colorA]], [, [, colorB]]) => (colorA < colorB ? 1 : -1))
      .map(([driver]) => driver)
  );

  protected readonly chartTheme = computed(() =>
    this.darkModeService.chartTheme() === 'dark' ? 'tracklab-dark' : ''
  );

  chartOptions = computed(() => ({
    tooltip: {
      trigger: 'axis',
      enterable: true,
      order: 'valueDesc',
      confine: false,
      appendTo: 'body',
      className: 'tl-tooltip',
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
      type: 'scroll',
      orient: 'horizontal',
      top: 0,
      padding: 10,
      wrap: true,
      scroll: true,
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
    series: Array.from(this.seriesData()?.entries()).map(
      ([key, [value, color]]) => ({
        name: key,
        type: 'line',
        data: value,
        color: color,
      })
    ),
    grid: {
      left: '2%',
      right: '2%',
      bottom: '0%',
      containLabel: true, // ensures labels aren't cut off
    },
  }));
}
