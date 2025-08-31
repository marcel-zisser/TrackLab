import { PositionTelemetry } from '../analytics/base/position-telemetry';
import { Driver } from '../analytics';

export interface TrackDominationResponse {
  coordinates: PositionTelemetry[];
  domination: string[];
  drivers: Driver[];
}
