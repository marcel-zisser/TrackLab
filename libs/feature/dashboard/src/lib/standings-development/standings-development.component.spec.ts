import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StandingsDevelopmentComponent } from './standings-development.component';

describe('StandingsDevelopmentComponent', () => {
  let component: StandingsDevelopmentComponent;
  let fixture: ComponentFixture<StandingsDevelopmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandingsDevelopmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StandingsDevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
