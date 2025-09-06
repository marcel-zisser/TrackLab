import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InfoPageComponent } from '@tracklab/shared/components';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'tl-disclaimer',
  imports: [InfoPageComponent, Divider],
  templateUrl: './acknowledgements.component.html',
  styleUrl: './acknowledgements.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcknowledgementsComponent {}
