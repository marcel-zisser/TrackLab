import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ThemeService } from '@tracklab/services';
import { DriverReliability, ReliabilityTrackerService, TeamReliability } from './reliability-tracker.service';

@Component({
  selector: 'tl-reliability-tracker',
  imports: [NgxEchartsDirective],
  templateUrl: './reliability-tracker.component.html',
  styleUrl: './reliability-tracker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReliabilityTrackerComponent {
  private readonly themeService = inject(ThemeService);
  private readonly reliabilityTrackerService = inject(
    ReliabilityTrackerService,
  );

  dataSelector = input.required<string>();

  reliabilityData = computed(() => {
    if (this.dataSelector() === 'driver') {
      return this.reliabilityTrackerService.driverReliability();
    } else {
      return this.reliabilityTrackerService.teamReliability();
    }
  });

  protected readonly chartTheme = this.themeService.chartTheme;

  chartOptions = computed(() => ({
    tooltip: {
      trigger: 'item',
      enterable: true,
      order: 'valueDesc',
      confine: false,
      appendTo: 'body',
      className: 'tl-tooltip',
      formatter: (val: any) => {
        const name = val.data.name;
        return this.generateTooltip(name);
      },
    },
    legend: {
      data: Array.from(this.reliabilityData().keys()),
      type: 'scroll',
      orient: 'horizontal',
      top: 0,
      wrap: true,
      scroll: true,
    },
    series: {
      name: this.dataSelector(),
      type: 'pie',
      selectedMode: 'single',
      top: 30,
      radius: [0, '75%'],
      label: {
        position: 'outside',
      },
      labelLine: {
        show: true,
      },
      data: this.mapReliabilityData(this.reliabilityData()),
    },
  }));

  /**
   * Maps the reliability data from raw format to chart format
   * @param reliabilityData the reliability data to map
   * @private
   */
  private mapReliabilityData(
    reliabilityData:
      | Map<string, DriverReliability>
      | Map<string, TeamReliability>,
  ) {
    return Array.from(reliabilityData.entries())
      .map(([key, value]) => ({
        name: key,
        value: Array.from(value.fails.values()).reduce(
          (acc, curr) => acc + curr,
          0,
        ),
        itemStyle: {
          color: value.color,
        },
      }))
      .sort((a, b) => b.value - a.value);
  }

  /**
   * Generates the tooltip for hovering an item
   * @param name the name of the item
   * @private
   */
  private generateTooltip(name: string) {
    const dnfReasons: string[] = [];
    const reliabilityData = this.reliabilityData().get(name);

    if (!reliabilityData) {
      return '';
    }

    reliabilityData.fails.forEach((value, key) => {
      dnfReasons.push(
        `
        <div class="col-span-2">${key}</div><div class="col-span-1">${value}</div>
      `,
      );
    });

    return `
      <div class="grid grid-cols-3 gap-x-4">
        <div class="col-span-3 font-bold mb-2">${name}</div>
        ${dnfReasons.reduce((acc, curr) => acc + curr, '')}
      </div>
    `;
  }
}
