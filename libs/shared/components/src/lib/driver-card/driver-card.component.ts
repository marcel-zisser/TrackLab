import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Avatar } from 'primeng/avatar';

@Component({
  selector: 'tl-driver-card',
  imports: [Avatar],
  templateUrl: './driver-card.component.html',
  styleUrl: './driver-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverCardComponent {}
