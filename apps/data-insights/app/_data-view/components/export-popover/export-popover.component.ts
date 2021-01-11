import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

import { CsvFileDelimiter, ExportFileExtension } from 'libs/models/payfactors-api';

@Component({
  selector: 'pf-export-popover',
  templateUrl: './export-popover.component.html',
  styleUrls: ['./export-popover.component.scss']
})
export class ExportPopoverComponent {
  @Input() exportDisabled: boolean;
  @Output() exportClicked: EventEmitter<{ fileExtension: ExportFileExtension, csvFileDelimiter: CsvFileDelimiter }> = new EventEmitter();

  @ViewChild(NgbPopover, { static: true}) exportPopover: NgbPopover;

  fileExtensions = ExportFileExtension;
  delimiters = CsvFileDelimiter;
  selectedExportFileExtension: ExportFileExtension;
  selectedCsvFileDelimiter: CsvFileDelimiter;

  handleExportPopoverShown(): void {
    if (this.exportPopover.isOpen()) {
      return;
    }
    this.selectedExportFileExtension = ExportFileExtension.Xlsx;
    this.selectedCsvFileDelimiter = CsvFileDelimiter.Comma;
  }

  handleExportClicked(): void {
    const csvFileDelimiter = this.selectedExportFileExtension === ExportFileExtension.Csv
      ? this.selectedCsvFileDelimiter
      : null;
    this.exportClicked.emit({ fileExtension: this.selectedExportFileExtension, csvFileDelimiter });
    this.exportPopover.close();
  }
}
