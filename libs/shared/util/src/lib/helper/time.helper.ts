import { Duration } from '@tracklab/models';

/**
 * Converts Duration to milliseconds
 * @param lapTime the duration to convert
 */
export function convertToMilliseconds(lapTime: Duration): number {
  return (
    (lapTime.hours * 60 * 60 * 1000 || 0) +
    (lapTime.minutes * 60 * 1000 || 0) +
    (lapTime.seconds * 1000 || 0) +
    (lapTime.milliseconds || 0)
  );
}

/**
 * Converts the milliseconds to a string in format mm:ss:mmmm
 * @param milliseconds the milliseconds to convert
 */
export function millisecondsToTimingString(milliseconds: number): string {
  const totalMs = Math.round(milliseconds);
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const millis = totalMs % 1000;
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}
