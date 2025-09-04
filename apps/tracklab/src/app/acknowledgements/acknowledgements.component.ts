import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InfoPageComponent } from '@tracklab/shared/components';

@Component({
  selector: 'tl-disclaimer',
  imports: [InfoPageComponent],
  templateUrl: './acknowledgements.component.html',
  styleUrl: './acknowledgements.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcknowledgementsComponent {}
