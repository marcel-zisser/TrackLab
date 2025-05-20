import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamStandingsComponent } from './team-standings.component';

describe('StandingsComponent', () => {
  let component: TeamStandingsComponent;
  let fixture: ComponentFixture<TeamStandingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamStandingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamStandingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
