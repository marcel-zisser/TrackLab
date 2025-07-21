import { Duration } from './duration';

export interface Lap {
  time: Duration | undefined;
  driver: string;
  driverNumber: number;
  team: string;
  teamColor: string;
  lapTime: Duration;
  lapNumber: number;
  stint: number;
  pitOutTime: Duration | undefined;
  pitInTime: Duration | undefined;
  sector1Time: Duration | undefined;
  sector2Time: Duration | undefined;
  sector3Time: Duration | undefined;
  speedI1: number;
  speedI2: number;
  speedFL: number;
  speedST: number;
  isPersonalBest: boolean;
  tireCompound: string;
  tireLife: number;
  freshTire: boolean;
  trackStatus: number;
  position: number;
  deleted: boolean;
  deletedReason: string;
}
