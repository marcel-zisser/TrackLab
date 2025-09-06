import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InfoPageComponent } from '@tracklab/shared/components';
import { Divider } from 'primeng/divider';
import { NgOptimizedImage } from '@angular/common';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'tl-disclaimer',
  imports: [InfoPageComponent, Divider, NgOptimizedImage],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  protected readonly PrimeIcons = PrimeIcons;
}
