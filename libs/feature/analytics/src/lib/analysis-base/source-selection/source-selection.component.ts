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
  Event,
  RaceSelection,
  SelectionOption,
  SourceSelectionConfig,
} from '@tracklab/models';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { MultiSelect } from 'primeng/multiselect';
import { SourceSelectionService } from './source-selection.service';
import { AuthenticationService } from '@tracklab/services';

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

  private readonly sourceSelectionService = inject(SourceSelectionService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authenticationService = inject(AuthenticationService);
  private initialConfig: SourceSelectionConfig | undefined;
  private isInitialized = false;

  protected readonly PrimeIcons = PrimeIcons;

  protected readonly years = this.sourceSelectionService.years;
  protected readonly events = this.sourceSelectionService.events;
  protected readonly sessions = computed<SelectionOption<string, string>[]>(
    () =>
      this.event()
        ?.sessionInfos?.reverse()
        .map((session) => ({
          label: session.name,
          value: session.name,
        })) ?? [],
  );
  protected readonly isAuthenticated =
    this.authenticationService.isAuthenticated;
  protected readonly drivers = this.sourceSelectionService.drivers;

  protected readonly year = signal<string | undefined>(undefined);
  protected readonly event = signal<Event | undefined>(undefined);
  protected readonly session = linkedSignal<
    Event | undefined,
    string | undefined
  >({
    source: this.event,
    computation: () => undefined,
  });

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
      this.sourceSelectionService.setEvents([
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
      this.sourceSelectionService.copySourceSelectionToClipboard(
        year,
        event,
        session,
        drivers,
      );
    }
  }

  /**
   * Adds the current chart configuration to the users collection
   * @protected
   */

  protected addToCollection() {
    const year = this.year();
    const event = this.event();
    const session = this.session();
    const drivers = this.getSelectedDrivers();

    if (year && event && (session || !this.withSessionSelection())) {
      this.sourceSelectionService.addToCollection(
        year,
        event,
        session,
        drivers,
      );
    }
  }

  /**
   * Creates the effect to watch the year, to dynamically load the corresponding races
   * @private
   */
  createEventScheduleEffect() {
    const year = this.year();

    if (year && this.isInitialized) {
      this.event.set(undefined);
      this.session.set(undefined);
      this.sourceSelectionService.loadEvents(year);
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
      this.sourceSelectionService.loadDrivers(year, event, session);
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
