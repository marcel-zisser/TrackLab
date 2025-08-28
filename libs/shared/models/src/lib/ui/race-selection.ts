import { Event } from '../analytics';

export interface RaceSelection {
  year: string;
  event?: Event;
  session?: string;
  drivers?: string[];
}
