import { Event } from '../analytics';

export interface SourceSelectionConfig {
  year: string;
  event: Event;
  session?: string;
}
