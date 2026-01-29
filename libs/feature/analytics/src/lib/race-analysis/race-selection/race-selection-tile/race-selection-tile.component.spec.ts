import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaceSelectionTileComponent } from './race-selection-tile.component';
describe('RaceSelectionTileComponent', () => {
  let component: RaceSelectionTileComponent;
  let fixture: ComponentFixture<RaceSelectionTileComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceSelectionTileComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(RaceSelectionTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
