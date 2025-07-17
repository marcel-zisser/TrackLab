import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { TableModule } from 'primeng/table';
import { Skeleton } from 'primeng/skeleton';
import { Column } from '@tracklab/models';

@Component({
  selector: 'tl-skeleton-table',
  imports: [TableModule, Skeleton],
  templateUrl: './skeleton-table.component.html',
  styleUrl: './skeleton-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonTableComponent {
  columns = input.required<Column[]>();
  rowNumber = input.required<number>();

  value = computed(() =>
    Array.from({ length: this.rowNumber() }, (_, i) => i + 1)
  );

}
