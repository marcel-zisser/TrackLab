import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tl-mode-selection',
  imports: [RouterLink],
  templateUrl: './mode-selection.component.html',
  styleUrl: './mode-selection.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModeSelectionComponent {}
