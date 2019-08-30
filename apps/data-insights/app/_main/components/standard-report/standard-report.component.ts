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
}
