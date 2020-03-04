import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrsSummaryControlComponent } from './trs-summary-control.component';

describe('TrsSummaryControlComponent', () => {
  let component: TrsSummaryControlComponent;
  let fixture: ComponentFixture<TrsSummaryControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrsSummaryControlComponent]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrsSummaryControlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.titleStyles = {} as any;
    component.controlData = {} as any;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
