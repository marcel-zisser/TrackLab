import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartDialogComponent } from './chart-dialog.component';

describe('CreateCollectionItemDialogComponent', () => {
  let component: ChartDialogComponent;
  let fixture: ComponentFixture<ChartDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
