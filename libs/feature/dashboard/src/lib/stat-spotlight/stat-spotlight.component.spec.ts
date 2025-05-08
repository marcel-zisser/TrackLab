import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatSpotlightComponent } from './stat-spotlight.component';

describe('StatSpotlightComponent', () => {
  let component: StatSpotlightComponent;
  let fixture: ComponentFixture<StatSpotlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatSpotlightComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatSpotlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
