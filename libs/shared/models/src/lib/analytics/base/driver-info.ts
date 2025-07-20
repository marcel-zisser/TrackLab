import { Driver } from './driver';
import { Team } from './team';

export interface DriverInfo {
  driver: Driver;
  team: Team;
  points: number;
  wins: number;
}
