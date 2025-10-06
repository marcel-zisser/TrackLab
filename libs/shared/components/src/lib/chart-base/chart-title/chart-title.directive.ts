import { Directive, effect, inject, input } from '@angular/core';
import { BaseChart } from '../models/base-chart';
import { deepEquals } from 'nx/src/utils/json-diff';

@Directive({
  selector: '[tlChartTitle]',
  standalone: true,
})
export class ChartTitleDirective {
  tlChartTitle = input(true);

  private host = inject(BaseChart);

  constructor() {
    effect(() => {
      const showTitle = this.tlChartTitle();

      if (showTitle) {
        return;
      }

      const chartOptions = this.host.chartOptions();
      const title = { show: false };
      const grid = { ...(chartOptions?.['grid'] ?? {}), top: 10 };
      const newChartOptions = { ...chartOptions, title: title, grid: grid };

      if (!deepEquals(chartOptions, newChartOptions)) {
        this.host.chartOptions.set(newChartOptions);
      }
    });
  }
}
