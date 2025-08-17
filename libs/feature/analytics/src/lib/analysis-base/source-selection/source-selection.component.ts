import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import {
  DriversResponse,
  Event,
  RaceSelection,
  SelectionOption,
  SourceSelectionConfig,
} from '@tracklab/models';
import { first, map, retry } from 'rxjs';
import { BackendService } from '@tracklab/services';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Button } from 'primeng/button';
import { Clipboard } from '@angular/cdk/clipboard';
import { MessageService } from 'primeng/api';
import { MultiSelect } from 'primeng/multiselect';

@Component({
  selector: 'tl-source-selection',
  imports: [FloatLabel, Select, FormsModule, Button, MultiSelect],
  templateUrl: './source-selection.component.html',
  styleUrl: './source-selection.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceSelectionComponent implements OnInit, AfterViewInit {
  withSessionSelection = input<boolean>(true);
  withDriverSelection = input<boolean>(true);
  driverSelectionType = input<'single' | 'double' | 'multiple'>('single');

  raceSelection = output<RaceSelection>();

  private readonly backendService = inject(BackendService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly clipboard = inject(Clipboard);
  private readonly messageService = inject(MessageService);
  private initialConfig: SourceSelectionConfig | undefined;
  private isInitialized = false;

  protected readonly years: SelectionOption<string, string>[] = Array.from(
    { length: new Date().getFullYear() - 2018 + 1 },
    (_, i) => 2018 + i,
  )
    .reverse()
    .map((year) => ({ label: `${year}`, value: `${year}` }));

  protected readonly year = signal<string | undefined>(undefined);
  protected readonly event = signal<Event | undefined>(undefined);
  protected readonly events = signal<SelectionOption<string, Event>[]>([]);

  protected readonly session = linkedSignal<
    Event | undefined,
    string | undefined
  >({
    source: this.event,
    computation: () => undefined,
  });

  protected readonly sessions = computed<SelectionOption<string, string>[]>(
    () =>
      this.event()
        ?.sessionInfos?.reverse()
        .map((session) => ({
          label: session.name,
          value: session.name,
        })) ?? [],
  );

  protected drivers = signal<string[]>([]);

  protected readonly driverOne = linkedSignal<string[], string | undefined>({
    source: this.drivers,
    computation: (source, previous) => {
      if (source.includes(previous?.value ?? '')) {
        return previous?.value;
      }
      return undefined;
    },
  });
  protected readonly driverTwo = linkedSignal<string[], string | undefined>({
    source: this.drivers,
    computation: (source, previous) => {
      if (source.includes(previous?.value ?? '')) {
        return previous?.value;
      }
      return undefined;
    },
  });
  protected readonly selectedDrivers = linkedSignal<string[], string[]>({
    source: this.drivers,
    computation: (source, previous) => {
      if (previous?.value.every((driver) => source.includes(driver))) {
        return previous.value;
      }
      return [];
    },
  });

  constructor() {
    effect(() => this.createEventScheduleEffect());
    effect(() => this.loadDriversEffect());
    effect(() => this.emitRaceSelectionEffect());
  }

  ngOnInit() {
    const config =
      this.activatedRoute.snapshot.queryParamMap.get('config') ?? '';

    if (config) {
      this.initialConfig = JSON.parse(
        decodeURIComponent(atob(config)),
      ) as SourceSelectionConfig;
      this.year.set(this.initialConfig.year);
    }
  }

  ngAfterViewInit() {
    this.isInitialized = true;

    if (this.initialConfig?.event && this.initialConfig?.session) {
      this.events.set([
        {
          label: this.initialConfig?.event.name,
          value: this.initialConfig?.event,
        },
      ]);
      this.event.set(this.initialConfig?.event);
      this.session.set(this.initialConfig?.session);

      if (this.driverSelectionType() === 'double') {
        if (this.initialConfig?.drivers?.[0]) {
          this.driverOne.set(this.initialConfig?.drivers[0]);
        }
        if (this.initialConfig?.drivers?.[1]) {
          this.driverTwo.set(this.initialConfig?.drivers[1]);
        }
      } else {
        this.selectedDrivers.set(this.initialConfig?.drivers ?? []);
      }
    }
  }

  /**
   * Copies the link to the chart into the clipboard.
   */
  protected copyChartLink() {
    const year = this.year();
    const event = this.event();
    const session = this.session();
    const drivers = this.getSelectedDrivers();

    if (year && event && (session || !this.withSessionSelection())) {
      const config = {
        year,
        event,
        session,
        drivers,
      } satisfies SourceSelectionConfig;

      const jsonConfig = JSON.stringify(config);
      const encodedConfig = btoa(encodeURIComponent(jsonConfig));

      this.clipboard.copy(
        `${window.location.origin}${window.location.pathname}?config=${encodedConfig}`,
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Link copied to clipboard',
      });
    }
  }

  /**
   * Creates the effect to watch the year, to dynamically load the corresponding races
   * @private
   */
  private createEventScheduleEffect() {
    if (this.year() && this.isInitialized) {
      this.event.set(undefined);
      this.session.set(undefined);
      this.backendService
        .doGet<Event[]>(`fast-f1/event-schedule?year=${this.year()}`)
        .pipe(
          first((races) => !!races),
          map((races: Event[]) =>
            races.map((race) => ({ label: race.name, value: race })),
          ),
          retry(5),
        )
        .subscribe({
          next: (races) => {
            this.events.set(races);
          },
        });
    }
  }

  /**
   * Effect to load the drivers once a session has been selected
   * @private
   */
  private loadDriversEffect() {
    const year = this.year();
    const event = this.event();
    const session = this.session();

    if (year && event && (session || !this.withSessionSelection())) {
      this.backendService
        .doGet<DriversResponse>(
          `fast-f1/drivers?year=${year}&round=${event.roundNumber}&session=${session}`,
        )
        .pipe(first())
        .subscribe((response) => this.drivers.set(response?.drivers ?? []));
    }
  }

  /**
   * Effect to emit the selected values once everything has been selected
   * @private
   */
  private emitRaceSelectionEffect() {
    const year = this.year();
    const event = this.event();
    const session = this.session();
    const drivers: string[] = this.getSelectedDrivers();

    if (
      year &&
      event &&
      (session || !this.withSessionSelection()) &&
      (drivers || !this.withDriverSelection())
    ) {
      this.raceSelection.emit({ year, event, session, drivers });
    }
  }

  private getSelectedDrivers(): string[] {
    let drivers: string[] = [];

    if (this.driverSelectionType() === 'double') {
      const driverOne = this.driverOne();
      const driverTwo = this.driverTwo();
      if (driverOne) {
        drivers.push(driverOne);
      }
      if (driverTwo) {
        drivers.push(driverTwo);
      }
    } else {
      drivers = this.selectedDrivers();
    }

    return drivers;
  }
}
