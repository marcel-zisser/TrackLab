import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ThemeService } from '@tracklab/services';
import { ECharts } from 'echarts/core';
import { SourceSelectionService } from '../source-selection/source-selection.service';

@Component({
  selector: 'tl-chart-base',
  imports: [CommonModule, NgxEchartsDirective],
  templateUrl: './chart-base.component.html',
  styleUrl: './chart-base.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartBaseComponent {
  loading = input.required<boolean>();
  options = input.required<any>();

  private readonly themeService = inject(ThemeService);
  private readonly sourceSelectionService = inject(SourceSelectionService);

  private chart: ECharts | undefined;
  protected readonly chartTheme = this.themeService.chartTheme();

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
