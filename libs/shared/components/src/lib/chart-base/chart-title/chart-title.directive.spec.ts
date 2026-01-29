import { describe, expect, it } from "vitest";
import { ChartTitleDirective } from './chart-title.directive';
describe('ChartTitleDirective', () => {
  it('should create an instance', () => {
    const directive = new ChartTitleDirective();
    expect(directive).toBeTruthy();
  });
});
