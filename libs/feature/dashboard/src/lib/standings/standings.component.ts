import { Component, input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Column } from '@tracklab/models';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'tl-standings',
  imports: [TableModule, Skeleton],
  templateUrl: './standings.component.html',
  styleUrl: './standings.component.css',
})
export class StandingsComponent {
  data = input.required<unknown[] | undefined>();
  columns = input.required<Column[]>();
}
