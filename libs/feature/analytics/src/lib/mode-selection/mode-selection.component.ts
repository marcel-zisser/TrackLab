import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tl-mode-selection',
  imports: [CommonModule, RouterLink],
  templateUrl: './mode-selection.component.html',
  styleUrl: './mode-selection.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModeSelectionComponent {}
