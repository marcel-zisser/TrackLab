import { beforeEach, describe, expect, it } from "vitest";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectorComparisonChartComponent } from './sector-comparison-chart.component';
describe('PositionChangesChartComponent', () => {
  let component: SectorComparisonChartComponent;
  let fixture: ComponentFixture<SectorComparisonChartComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectorComparisonChartComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SectorComparisonChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
