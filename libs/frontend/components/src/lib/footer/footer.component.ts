import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'tl-footer',
  imports: [Divider],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
