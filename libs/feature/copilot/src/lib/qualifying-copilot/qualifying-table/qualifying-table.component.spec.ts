import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QualifyingTableComponent } from './qualifying-table.component';

describe('QualifyingTableComponent', () => {
  let component: QualifyingTableComponent;
  let fixture: ComponentFixture<QualifyingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualifyingTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QualifyingTableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
