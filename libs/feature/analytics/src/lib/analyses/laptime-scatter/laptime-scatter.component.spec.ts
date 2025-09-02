import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LaptimeScatterComponent } from './laptime-scatter.component';

describe('LaptimeScatterComponent', () => {
  let component: LaptimeScatterComponent;
  let fixture: ComponentFixture<LaptimeScatterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaptimeScatterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LaptimeScatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
