export interface Driver {
  id: string;
  permanentNumber: string;
  code: string;
  givenName: string;
  familyName: string;
  dateOfBirth?: string;
  nationality?: string;
  countryCode?: string;
  headshotUrl?: string;
  color?: string;
  lineStyle?: string;
}
