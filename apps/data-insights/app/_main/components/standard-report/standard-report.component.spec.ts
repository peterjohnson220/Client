import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { StandardReportComponent } from './standard-report.component';
import { generateMockWorkbook } from '../../models';

describe('Data Insights - Standard Report Component', () => {
  let instance: StandardReportComponent;
  let fixture: ComponentFixture<StandardReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardReportComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(StandardReportComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should set displayOverlay to true when handling mouse over workbook with description', () => {
    instance.workbook = generateMockWorkbook();

    instance.handleMouseOverWorkbookContainer();

    expect(instance.displayOverlay).toEqual(true);
  });

  it('should NOT set displayOverlay to true when handling mouse over workbook with NO description', () => {
    instance.workbook = { ...generateMockWorkbook(), WorkbookDescription: null };
    instance.displayOverlay = false;

    instance.handleMouseOverWorkbookContainer();

    expect(instance.displayOverlay).toEqual(false);
  });

  it('should set displayOverlay to false when handling mouse leave workbook with description', () => {
    instance.workbook = generateMockWorkbook();

    instance.handleMouseLeaveWorkbookContainer();

    expect(instance.displayOverlay).toEqual(false);
  });
});
