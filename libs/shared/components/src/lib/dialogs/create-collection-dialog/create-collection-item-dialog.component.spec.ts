import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCollectionItemDialogComponent } from './create-collection-item-dialog.component';

describe('CreateCollectionItemDialogComponent', () => {
  let component: CreateCollectionItemDialogComponent;
  let fixture: ComponentFixture<CreateCollectionItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCollectionItemDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCollectionItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
