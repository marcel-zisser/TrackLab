export interface AnalyticsTile {
  title: string;
  description: string;
  icon: string;
  tags: string[];
  callback: () => void;
}
