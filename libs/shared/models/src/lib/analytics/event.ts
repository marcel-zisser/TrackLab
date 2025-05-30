import { SessionInfo } from './session-info';

export interface Event {
  roundNumber: number;
  country: string;
  location: string;
  officialName: string;
  name: string;
  date: string;
  format: string;
  f1ApiSupport: boolean;
  sessionInfos: SessionInfo[];
}
