import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PositionChangesComponent } from './position-changes.component';

describe('PositionChangesComponent', () => {
  let component: PositionChangesComponent;
  let fixture: ComponentFixture<PositionChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionChangesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PositionChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
