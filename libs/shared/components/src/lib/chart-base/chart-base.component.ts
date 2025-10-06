import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { SourceSelectionService, ThemeService } from '@tracklab/services';
import { ECharts } from 'echarts/core';

@Component({
  selector: 'tl-chart-base',
  imports: [NgxEchartsDirective],
  templateUrl: './chart-base.component.html',
  styleUrl: './chart-base.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartBaseComponent {
  loading = input.required<boolean>();
  options = input.required<any>();
  private readonly themeService = inject(ThemeService);
  private readonly sourceSelectionService = inject(SourceSelectionService);

  protected readonly chartTheme = this.themeService.chartTheme();

  chart: ECharts | undefined;

  constructor() {
    effect(() => {
      const chartTheme = this.themeService.chartTheme();
      this.chart?.setTheme(chartTheme);
    });
  }

  protected onChartInit(ec: ECharts) {
    this.chart = ec;
    this.sourceSelectionService.setChartInstance(ec);
  }
}
