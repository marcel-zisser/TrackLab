import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaceSelectionComponent } from './race-selection.component';
describe('RaceSelectionComponent', () => {
  let component: RaceSelectionComponent;
  let fixture: ComponentFixture<RaceSelectionComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceSelectionComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(RaceSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
