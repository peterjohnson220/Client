import { Component, Input } from '@angular/core';

import { Workbook } from '../../models';

@Component({
  selector: 'pf-standard-report',
  templateUrl: './standard-report.component.html',
  styleUrls: ['./standard-report.component.scss']
})
export class StandardReportComponent {
  @Input() workbook: Workbook;

  displayOverlay: boolean;
  MAX_TEXT_LENGTH = 150;

  handleMouseOverWorkbookContainer() {
    if (this.workbook.WorkbookDescription) {
      this.displayOverlay = true;
    }
  }

  handleMouseLeaveWorkbookContainer() {
    if (this.workbook.WorkbookDescription) {
      this.displayOverlay = false;
    }
  }

  get workbookDescription(): string {
    if (!this.workbook.WorkbookDescription) {
      return '';
    }
    return this.workbook.WorkbookDescription.length > this.MAX_TEXT_LENGTH ?
      this.workbook.WorkbookDescription.substr(0, this.MAX_TEXT_LENGTH) + '...' : this.workbook.WorkbookDescription;
  }
}
