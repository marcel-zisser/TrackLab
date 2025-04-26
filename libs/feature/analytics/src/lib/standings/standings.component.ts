import { Component, effect, input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Column, StandingsEntry } from '@tracklab/models';
import { Skeleton } from 'primeng/skeleton';
import { NgForOf, NgIf } from '@angular/common';

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
