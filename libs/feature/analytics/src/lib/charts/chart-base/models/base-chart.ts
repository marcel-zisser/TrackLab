import { EChartsCoreOption } from 'echarts';
import { WritableSignal } from '@angular/core';
import { RaceSelection } from '@tracklab/models';

export abstract class BaseChart {
  abstract chartOptions: WritableSignal<EChartsCoreOption>;
  protected abstract loadData(selectedRace: RaceSelection): void;
}
