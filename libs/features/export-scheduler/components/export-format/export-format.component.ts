import { Component } from '@angular/core';

import { ExportScheduleHelper } from 'libs/features/export-scheduler/models/export-schedule.model';
import { CsvFileDelimiter } from 'libs/models/payfactors-api/reports/request';

@Component({
  selector: 'pf-export-format',
  templateUrl: './export-format.component.html',
  styleUrls: ['./export-format.component.scss']
})
export class ExportFormatComponent {
  selectedFormat: string;
  selectedSeparatorType: string;

  fileFormats = ExportScheduleHelper.fileFormats;
  csvFileFormat = ExportScheduleHelper.csvFileFormat;
  csvDelimiters = [CsvFileDelimiter.Comma, CsvFileDelimiter.Pipe, CsvFileDelimiter.Tab];

  constructor() {
    this.selectedFormat = ExportScheduleHelper.excelFileFormat;
  }

  handleFormatChange(): void {
    if (this.selectedFormat === ExportScheduleHelper.csvFileFormat) {
      this.selectedSeparatorType = CsvFileDelimiter.Comma;
    } else {
      this.selectedSeparatorType = null;
    }
  }

  reset() {
    this.selectedFormat = ExportScheduleHelper.excelFileFormat;
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
