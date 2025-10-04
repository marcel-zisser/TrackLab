import { EChartsCoreOption } from 'echarts';
import { Signal } from '@angular/core';

export interface ChartConfig {
  chartOptions: Signal<EChartsCoreOption>;
}
