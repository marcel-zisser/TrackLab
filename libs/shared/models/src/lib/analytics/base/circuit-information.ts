import { TrackLocation } from './track-location';

export interface CircuitInformation {
  corners: TrackLocation[];
  marshallLights: TrackLocation[];
  marshallSectors: TrackLocation[];
  rotation: number;
}
