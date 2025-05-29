import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../dashboard.service';
import { ProgressBar } from 'primeng/progressbar';

@Component({
  selector: 'tl-season-progress',
  imports: [CommonModule, ProgressBar],
  templateUrl: './season-progress.component.html',
  styleUrl: './season-progress.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeasonProgressComponent {
  private readonly dashboardService = inject(DashboardService);

  private eventSchedule = this.dashboardService.eventSchedule;

  protected totalEvents = computed(() => this.eventSchedule()?.length);
  protected finishedEvents = computed(() =>
    this.eventSchedule()?.filter(event => new Date(event.eventDate) < new Date()).length
  );
  protected percentageFinished = computed( () => (
    ((this.finishedEvents() ?? 0) / (this.totalEvents() ?? 1)) * 100).toFixed(2)
  );
  protected nextEvent = computed( () =>
    this.eventSchedule()?.find(event => new Date(event.eventDate) > new Date())
  );


}
