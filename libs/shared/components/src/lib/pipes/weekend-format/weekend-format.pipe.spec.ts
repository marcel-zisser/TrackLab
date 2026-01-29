import { describe, expect, it } from "vitest";
import { WeekendFormatPipe } from './weekend-format.pipe';
describe('WeekendFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new WeekendFormatPipe();
    expect(pipe).toBeTruthy();
  });
});
