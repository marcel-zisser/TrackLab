import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { EventData, RaceSelection } from '@tracklab/models';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap } from 'rxjs';
import { inject } from '@angular/core';
import { BackendService } from '@tracklab/services';
import { tapResponse } from '@ngrx/operators';

type RaceAnalysisState = {
  year: number;
  race: EventData | undefined;
  session: string | undefined;
  schedule: EventData[] | undefined;
};

const initialState: RaceAnalysisState = {
  year: new Date().getFullYear(),
  race: undefined,
  session: undefined,
  schedule: undefined,
};

export const RaceAnalysisStore = signalStore(
  withState<RaceAnalysisState>(initialState),
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
    loadSchedule: rxMethod<number>(
      pipe(
        distinctUntilChanged(),
        switchMap((year) => {
          return backendService
            .doGet<EventData[]>(`fast-f1/event-schedule?year=${year}`)
            .pipe(
              tapResponse({
                next: (schedule) => patchState(store, { schedule }),
                error: console.error,
              }),
            );
        }),
      ),
    ),
  })),
);
