import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';
import { Avatar } from 'primeng/avatar';
import { DriverInfo } from '@tracklab/models';

@Component({
  selector: 'tl-driver-card',
  imports: [Avatar],
  templateUrl: './driver-card.component.html',
  styleUrl: './driver-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverCardComponent {
  driverInfo = input.required<DriverInfo | null>();
}
