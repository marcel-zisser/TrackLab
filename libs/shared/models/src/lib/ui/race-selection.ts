import { EventData } from '../analytics';

export interface RaceSelection {
  year: string;
  event?: EventData;
  session?: string;
  drivers?: string[];
}
