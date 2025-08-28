import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WdcContendersComponent } from './wdc-contenders.component';

describe('WdcContendersComponent', () => {
  let component: WdcContendersComponent;
  let fixture: ComponentFixture<WdcContendersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WdcContendersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WdcContendersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
