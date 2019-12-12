import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { DataViewReportCardComponent } from './data-view-report-card.component';

describe('Data Insights - Dataviews View Card Component', () => {
  let instance: DataViewReportCardComponent;
  let fixture: ComponentFixture<DataViewReportCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ DataViewReportCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(DataViewReportCardComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should display overlay when mouse over view container', () => {
    instance.handleMouseOverViewContainer();
    fixture.detectChanges();

    expect(instance.displayActionsOverlay).toEqual(true);
  });

  it('should NOT display overlay when mouse leave view container', () => {
    instance.handleMouseLeaveViewContainer();
    fixture.detectChanges();

    expect(instance.displayActionsOverlay).toEqual(false);
  });
});
