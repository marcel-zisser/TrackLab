import { EventData } from '../analytics';

export interface SourceSelectionConfig {
  year: string;
  event?: EventData;
  session?: string;
  drivers?: string[];
}
