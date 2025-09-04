import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InfoPageComponent } from '@tracklab/shared/components';

@Component({
  selector: 'tl-disclaimer',
  imports: [InfoPageComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {}
