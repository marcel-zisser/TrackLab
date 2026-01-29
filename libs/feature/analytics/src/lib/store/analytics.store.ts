import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ColorResponse, EventData, RaceSelection } from '@tracklab/models';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, filter, pipe, switchMap } from 'rxjs';
import { inject } from '@angular/core';
import { BackendService } from '@tracklab/services';
import { tapResponse } from '@ngrx/operators';

type AnalyticsState = {
  year: number;
  race: EventData | undefined;
  session: string | undefined;
  schedule: EventData[] | undefined;
  colors: ColorResponse | undefined;
};

const initialState: AnalyticsState = {
  year: new Date().getFullYear(),
  race: undefined,
  session: undefined,
  schedule: undefined,
  colors: undefined,
};

export const AnalyticsStore = signalStore(
  withState<AnalyticsState>(initialState),
  withComputed(({ year, race, session }) => ({
    raceSelection: (): RaceSelection | undefined => {
      if (year() && race() && session()) {
        return {
          year: `${year()}`,
          event: race(),
          session: session(),
        } satisfies RaceSelection;
      } else {
        return undefined;
      }
    },
  })),
  withMethods((store, backendService = inject(BackendService)) => ({
    updateYear(year: number): void {
      patchState(store, () => ({ year: year }));
      patchState(store, () => ({ race: undefined }));
      patchState(store, () => ({ session: undefined }));
    },
    updateRace(event: EventData): void {
      patchState(store, () => ({ race: event }));
      patchState(store, () => ({ session: undefined }));
    },
    updateSession(session: string): void {
      patchState(store, () => ({ session: session }));
    },
    updateRaceSelection(selection: RaceSelection): void {
      patchState(store, () => ({
        year: Number(selection.year),
        race: selection.event,
        session: selection.session,
      }));
    },
    loadSchedule: rxMethod<number>(
      pipe(
        distinctUntilChanged(),
        switchMap((year) => {
          return backendService
            .doGet<EventData[]>(`analytics/event-schedule?year=${year}`)
            .pipe(
              tapResponse({
                next: (schedule) => patchState(store, { schedule }),
                error: console.error,
              }),
            );
        }),
      ),
    ),
    loadColors: rxMethod<RaceSelection | undefined>(
      pipe(
        filter((raceSelection) => !!raceSelection),
        distinctUntilChanged(),
        switchMap((raceSelection) => {
          return backendService
            .doGet<ColorResponse>(
              `analytics/colors?year=${raceSelection.year}&round=${raceSelection.event?.roundNumber}&session=${raceSelection.session}`,
            )
            .pipe(
              tapResponse({
                next: (colorResponse) =>
                  patchState(store, { colors: colorResponse }),
                error: console.error,
              }),
            );
        }),
      ),
    ),
  })),
);
