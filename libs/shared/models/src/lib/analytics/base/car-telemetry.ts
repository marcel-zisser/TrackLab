import { PositionTelemetry } from './position-telemetry';

export interface CarTelemetry {
  driver: string;
  speed: number;
  rpm: number;
  nGear: number;
  throttle: number;
  brake: boolean;
  drs: number;
  distance: number;
  position?: PositionTelemetry;
}
