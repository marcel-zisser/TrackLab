import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tl-standings-development',
  imports: [CommonModule],
  templateUrl: './standings-development.component.html',
  styleUrl: './standings-development.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StandingsDevelopmentComponent {}
