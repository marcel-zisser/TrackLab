import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../dashboard.service';
import { ProgressBar } from 'primeng/progressbar';
import { HttpParams } from '@angular/common/http';
import { Circuit } from '@tracklab/models';
import { BackendService } from '@tracklab/services';
import { first } from 'rxjs';
import { CountdownComponent } from '@tracklab/shared/components';

@Component({
  selector: 'tl-season-progress',
  imports: [CommonModule, ProgressBar, CountdownComponent],
  templateUrl: './season-progress.component.html',
  styleUrl: './season-progress.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeasonProgressComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly backendService = inject(BackendService);

  private eventSchedule = this.dashboardService.eventSchedule;

  protected totalEvents = computed(() => this.eventSchedule()?.length);
  protected finishedEvents = computed(() =>
    this.eventSchedule()?.filter(event => new Date(event.date) < new Date()).length
  );
  protected percentageFinished = computed( () => (
    ((this.finishedEvents() ?? 0) / (this.totalEvents() ?? 1)) * 100).toFixed(2)
  );
  protected nextEvent = computed( () =>
    this.eventSchedule()?.find(event =>
      event.sessionInfos.some(session => new Date(session.date) > new Date())
    )
  );
  protected raceDate = computed(() => {
    const raceDateString =
      this.nextEvent()?.sessionInfos.find( session => session.name === 'Race')?.date ?? '';

    return new Date(raceDateString);
  })

  protected circuit = signal<Circuit | undefined>(undefined);

  constructor() {
    effect(() => {
      if (this.nextEvent()) {
        const params = new HttpParams().set('year', new Date().getFullYear(),).set('round', this.nextEvent()?.roundNumber ?? '')
        this.backendService.doGet<Circuit>('fast-f1/circuit', params)
          .pipe(first())
          .subscribe( (circuit) => {
            this.circuit.set(circuit);
          });
      }
    });
  }

}
