import { ChangeDetectionStrategy, Component, computed, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tl-countdown',
  imports: [CommonModule],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountdownComponent implements OnInit {
  targetDate = input.required<Date>();

  private now = signal(new Date());
  protected countdown = computed(() => {
    const distance = this.targetDate().getTime() - this.now().getTime();
    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0'),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0'),
      seconds: Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0')
    };
  });

  ngOnInit(): void {
    setInterval(() => this.now.set(new Date()), 1000);
  }
}
