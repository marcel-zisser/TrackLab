import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InfoPageComponent } from '@tracklab/shared/components';

@Component({
  selector: 'tl-disclaimer',
  imports: [InfoPageComponent],
  templateUrl: './disclaimer.component.html',
  styleUrl: './disclaimer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisclaimerComponent {}
