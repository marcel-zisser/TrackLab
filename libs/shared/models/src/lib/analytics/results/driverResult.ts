import { Team } from '../base/team';
import { Driver } from '../base/driver';

export interface DriverResult {
  position: number;
  points: number;
  driver: Driver;
  team: Team;
  gridPosition: number;
  laps?: number;
  status: string;
}
