import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { BackendService, DarkModeService } from '@tracklab/services';
import { DevelopmentResponse, StandingsResponse } from '@tracklab/models';

@Component({
  selector: 'tl-standings-development',
  imports: [NgxEchartsDirective],
  templateUrl: './standings-development.component.html',
  styleUrl: './standings-development.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StandingsDevelopmentComponent {
  private readonly darkModeService = inject(DarkModeService);
  private readonly backendService = inject(BackendService);

  private development =
    this.backendService.doGet<DevelopmentResponse>('dashboard/development');

  protected readonly chartTheme = computed(() =>
    this.darkModeService.chartTheme() === 'dark' ? 'tracklab-dark' : '');

  chartOptions = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['Email', 'Ads', 'Search', 'Direct', 'Referral'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: 'Ads',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: 'Search',
        type: 'line',
        stack: 'Total',
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: 'Direct',
        type: 'line',
        stack: 'Total',
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: 'Referral',
        type: 'line',
        stack: 'Total',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
  };
}
