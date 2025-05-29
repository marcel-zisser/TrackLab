import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeasonProgressComponent } from './season-progress.component';

describe('SeasonProgressComponent', () => {
  let component: SeasonProgressComponent;
  let fixture: ComponentFixture<SeasonProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonProgressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
