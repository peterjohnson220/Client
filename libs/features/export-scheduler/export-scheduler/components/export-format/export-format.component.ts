import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ExportScheduleHelper } from 'libs/features/export-scheduler/export-scheduler/models/export-schedule.model';
import { CsvFileDelimiter } from 'libs/models/payfactors-api/reports/request';

@Component({
  selector: 'pf-export-format',
  templateUrl: './export-format.component.html',
  styleUrls: ['./export-format.component.scss']
})
export class ExportFormatComponent implements OnChanges {
  @Input() scheduledFormat: string;
  @Input() scheduledFormatSeparatorType: string;

  selectedFormat: string;
  selectedSeparatorType: string;

  fileFormats = ExportScheduleHelper.fileFormats;
  csvFileFormat = ExportScheduleHelper.csvFileFormat;
  csvDelimiters = [CsvFileDelimiter.Comma, CsvFileDelimiter.Pipe, CsvFileDelimiter.Tab];
  changesMade = false;

  constructor() {
    this.selectedFormat = ExportScheduleHelper.excelFileFormat;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.scheduledFormat?.currentValue) {
      this.selectedFormat = this.scheduledFormat;
      if (this.selectedFormat === this.csvFileFormat) {
        this.selectedSeparatorType = this.scheduledFormatSeparatorType;
      }
    }
  }

  handleFormatChange(): void {
    this.changesMade = this.scheduledFormat !== this.selectedFormat;
    if (this.selectedFormat === ExportScheduleHelper.csvFileFormat) {
      this.selectedSeparatorType = CsvFileDelimiter.Comma;
    } else {
      this.selectedSeparatorType = null;
    }
  }

  handleSeparatorTypeChange(): void {
    if (this.scheduledFormat) {
      this.changesMade = this.selectedSeparatorType !== this.scheduledFormatSeparatorType;
    }
  }

  reset() {
    this.selectedFormat = ExportScheduleHelper.excelFileFormat;
    this.changesMade = false;
  }

  get isValid(): boolean {
    switch (this.selectedFormat) {
      case ExportScheduleHelper.excelFileFormat:
        return true;
      case ExportScheduleHelper.csvFileFormat:
        return this.selectedSeparatorType?.length > 0;
      default:
        return false;
    }
  }
}
