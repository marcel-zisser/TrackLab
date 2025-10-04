import { Directive, input } from '@angular/core';
import { ChartConfig } from '../models/chart-config.interface';

@Directive({
  selector: '[tlChartTitle]',
})
export class ChartTitleDirective {
  tlChartTitle = input(true);

  constructor(private host: ChartConfig) {}
}
