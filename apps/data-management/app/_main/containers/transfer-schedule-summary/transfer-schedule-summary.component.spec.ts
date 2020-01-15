import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferScheduleSummaryComponent } from './transfer-schedule-summary.component';

describe('TransferScheduleSummaryComponent', () => {
  let component: TransferScheduleSummaryComponent;
  let fixture: ComponentFixture<TransferScheduleSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferScheduleSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferScheduleSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
