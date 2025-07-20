import { DriverResult } from './driverResult';
import { Location } from '../base/location';

export interface RaceResult {
  year: number;
  date: string;
  type: string;
  location: Location;
  results: DriverResult[];
}
