import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Event } from '@tracklab/models';

type RaceAnalysisState = {
  year: number;
  event: string | undefined;
  session: string | undefined;
  schedule: Event[];
};

const initialState: RaceAnalysisState = {
  year: new Date().getFullYear(),
  event: undefined,
  session: undefined,
  schedule: [],
};

export const RaceAnalysisStore = signalStore(
  withState(initialState),
  withMethods((store) => ({
    updateYear(year: number): void {
      patchState(store, () => ({ year: year }));
    },
    updateEvent(event: string): void {
      patchState(store, () => ({ event: event }));
    },
    updateSession(session: string): void {
      patchState(store, () => ({ session: session }));
    },
    updateSchedule(schedule: Event[]): void {
      patchState(store, () => ({ schedule: schedule }));
    },
  })),
);
