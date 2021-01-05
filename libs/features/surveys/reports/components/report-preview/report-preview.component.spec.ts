import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ReportPreviewComponent } from './report-preview.component';
import { generateMockWorkbook } from '../../models';

describe('Data Insights - Report Preview Component', () => {
  let instance: ReportPreviewComponent;
  let fixture: ComponentFixture<ReportPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPreviewComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(ReportPreviewComponent);
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
