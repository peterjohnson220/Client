import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrsSummaryControlComponent } from './trs-summary-control.component';

describe('TrsSummaryControlComponent', () => {
  let component: TrsSummaryControlComponent;
  let fixture: ComponentFixture<TrsSummaryControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrsSummaryControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrsSummaryControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
