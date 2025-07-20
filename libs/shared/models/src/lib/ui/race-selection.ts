import { Event } from '../analytics/base/event';

export interface RaceSelection {
  year: string;
  event: Event;
  session?: string;
}
