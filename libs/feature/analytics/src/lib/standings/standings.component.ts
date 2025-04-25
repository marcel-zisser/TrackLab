import { Component, effect, input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { StandingsEntry } from '@tracklab/models';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'tl-standings',
  imports: [TableModule, Skeleton],
  templateUrl: './standings.component.html',
  styleUrl: './standings.component.css',
})
export class StandingsComponent {
  standings = input.required<StandingsEntry[] | undefined>();

  constructor() {
    effect(() => {
      if (this.standings()) {
        console.log(this.standings());
      }
    });
  }
}
