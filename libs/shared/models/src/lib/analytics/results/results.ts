import { Constructor } from '../constructor';
import { Driver } from '../driver';

export interface Result {
  position: number;
  points: number;
  driver: Driver;
  constructor: Constructor;
  grid: number;
  laps: number;
  status: string;
}
