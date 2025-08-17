import {
  ChangeDetectionStrategy,
  Component,
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

  protected readonly chartTheme = this.themeService.chartTheme;

  protected onChartInit(ec: ECharts) {
    this.sourceSelectionService.setChartInstance(ec);
  }
}
