import { Team } from '../team';
import { Driver } from '../driver';

export interface DriverResult {
  position: number;
  points: number;
  driver: Driver;
  team: Team;
  gridPosition: number;
  laps?: number;
  status: string;
}
