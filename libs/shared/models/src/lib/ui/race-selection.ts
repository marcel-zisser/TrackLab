import { EventData } from '../analytics';

export interface EventSelection {
  year: string;
  event?: EventData;
  session?: string;
  drivers?: string[];
}
