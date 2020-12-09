import { Component } from '@angular/core';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

import { ExportFileExtension, ExportFormat } from 'libs/features/export-scheduler/models/export-schedule.model';
import { CsvFileDelimiter } from 'libs/models/payfactors-api/reports/request';

@Component({
  selector: 'pf-export-format',
  templateUrl: './export-format.component.html',
  styleUrls: ['./export-format.component.scss']
})
export class ExportFormatComponent {

  selectedFileExtension: ExportFormat = {
    Format: ExportFileExtension.Excel,
    SeparatorType: ''
  };
  exportFileExtension = ExportFileExtension;
  fileExtensions = [ExportFileExtension.Excel, ExportFileExtension.Csv];
  csvDelimiters = [CsvFileDelimiter.Comma, CsvFileDelimiter.Pipe, CsvFileDelimiter.Tab];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
  };

  handleFormatChange(): void {
    if (this.selectedFileExtension.Format === ExportFileExtension.Csv) {
      this.selectedFileExtension.SeparatorType = CsvFileDelimiter.Comma
    }
  }
}
