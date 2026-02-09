import { beforeEach, describe, expect, it } from "vitest";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventSelectionTileComponent } from './race-selection-tile.component';
describe('EventSelectionTileComponent', () => {
  let component: EventSelectionTileComponent;
  let fixture: ComponentFixture<EventSelectionTileComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventSelectionTileComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(EventSelectionTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
