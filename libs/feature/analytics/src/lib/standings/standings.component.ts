import { Component, input } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'tl-standings',
  imports: [TableModule],
  templateUrl: './standings.component.html',
  styleUrl: './standings.component.css',
})
export class StandingsComponent {
  items = input.required<any[]>()
}
