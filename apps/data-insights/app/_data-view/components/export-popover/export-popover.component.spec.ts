import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbPopover, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { CsvFileDelimiter, ExportFileExtension } from 'libs/models/payfactors-api';

import { ExportPopoverComponent } from './export-popover.component';

describe('Data Insights - Export Popover Component', () => {
  let instance: ExportPopoverComponent;
  let fixture: ComponentFixture<ExportPopoverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ NgbPopoverModule ],
      declarations: [ ExportPopoverComponent ],
      providers: [
        {
          provide: NgbPopover,
          useValue: { close: jest.fn() }
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ExportPopoverComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should set selected file extension and delimiter to default values when popover opened', () => {
    instance.handleExportPopoverShown();

    expect(instance.selectedExportFileExtension).toEqual(ExportFileExtension.Xlsx);
    expect(instance.selectedCsvFileDelimiter).toEqual(CsvFileDelimiter.Comma);
  });

  it.each([
    [ExportFileExtension.Xlsx, CsvFileDelimiter.Tab, null],
    [ExportFileExtension.Csv, CsvFileDelimiter.Tab, CsvFileDelimiter.Tab]])
    ('it should emit exportClicked event with correct file extension and delimiter', (fileExtension, selectedDelimiter, csvFileDelimiter) => {
      spyOn(instance.exportClicked, 'emit');

      instance.selectedExportFileExtension = fileExtension;
      instance.selectedCsvFileDelimiter = selectedDelimiter;
      fixture.detectChanges();

      instance.handleExportClicked();

      expect(instance.exportClicked.emit).toHaveBeenCalledWith({ fileExtension, csvFileDelimiter });
  });
});
