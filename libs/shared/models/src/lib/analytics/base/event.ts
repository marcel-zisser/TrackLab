import { SessionInfo } from './session-info';

export interface Event {
  roundNumber: number;
  name: string;
  country?: string;
  location?: string;
  officialName?: string;
  date?: string;
  format?: string;
  f1ApiSupport?: boolean;
  sessionInfos?: SessionInfo[];
}
