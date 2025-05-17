import { DriverResult } from './driverResult';
import { Location } from '../location';

export interface RaceResult {
  year: number;
  date: string;
  type: string;
  location: Location;
  results: DriverResult[];
}
