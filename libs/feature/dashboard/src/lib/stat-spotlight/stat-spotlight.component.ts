import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { Column } from '@tracklab/models';

@Component({
  selector: 'tl-stat-spotlight',
  imports: [Skeleton, TableModule],
  templateUrl: './stat-spotlight.component.html',
  styleUrl: './stat-spotlight.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatSpotlightComponent {
  data = input.required<unknown[] | undefined>();
  columns = input.required<Column[]>();
}
