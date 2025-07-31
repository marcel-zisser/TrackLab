import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamPaceComparisonComponent } from './team-pace-comparison.component';

describe('TeamPaceComponent', () => {
  let component: TeamPaceComparisonComponent;
  let fixture: ComponentFixture<TeamPaceComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamPaceComparisonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamPaceComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
