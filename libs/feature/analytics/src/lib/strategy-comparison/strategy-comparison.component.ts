import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AnalysisBaseComponent } from '../analysis-base/analysis-base.component';
import { InputNumber } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ThemeService } from '@tracklab/services';

@Component({
  selector: 'tl-strategy-comparison',
  imports: [
    AnalysisBaseComponent,
    InputNumber,
    FormsModule,
    NgxEchartsDirective,
  ],
  templateUrl: './strategy-comparison.component.html',
  styleUrl: './strategy-comparison.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StrategyComparisonComponent {
  private readonly themeService = inject(ThemeService);

  protected year: number | undefined = 10;
  protected raceOptions: string[] = [];
  protected race: string | undefined;

  protected seriesData = signal(undefined);
  protected readonly chartTheme = this.themeService.chartTheme;

  chartOptions = computed(() => ({
    tooltip: {
      trigger: 'item',
      enterable: true,
      order: 'valueDesc',
      confine: false,
      appendTo: 'body',
      className: 'tl-tooltip'
    },
    legend: {
      data: [],
      type: 'scroll',
      orient: 'horizontal',
      top: 0,
      wrap: true,
      scroll: true
    },
    toolbox: {
      feature: {
        // saveAsImage: {},
      }
    },
    series: {
      name: 'Strategy',
      type: 'pie',
      selectedMode: 'single',
      top: 30,
      radius: [0, '75%'],
      label: {
        position: 'outside'
      },
      labelLine: {
        show: true
      },
      data: []
    }
  }));
}
