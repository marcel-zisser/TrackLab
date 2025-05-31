import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Column } from '@tracklab/models';
import { SkeletonTableComponent } from '@tracklab/shared/components';

@Component({
  selector: 'tl-stat-spotlight',
  imports: [TableModule, SkeletonTableComponent],
  templateUrl: './stat-spotlight.component.html',
  styleUrl: './stat-spotlight.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatSpotlightComponent implements OnInit {
  data = input.required<unknown[] | undefined>();

  statSpotlightColumns: Column[] = [];

  ngOnInit() {
    this.statSpotlightColumns = [
      { field: 'category', header: 'Category' },
      { field: 'driver', header: 'Driver' },
      { field: 'data', header: 'Data' },
    ];
  }
}
