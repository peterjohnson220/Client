import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Workbook } from '../../models';

@Component({
  selector: 'pf-report-preview',
  templateUrl: './report-preview.component.html',
  styleUrls: ['./report-preview.component.scss']
})
export class ReportPreviewComponent {
  @Input() workbook: Workbook;
  @Input() isLinkAction = true;
  @Output() onClickEvent: EventEmitter<Workbook> = new EventEmitter();

  displayOverlay: boolean;

  handleWorkbookClick(): void {
    this.onClickEvent.emit(this.workbook);
  }

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
