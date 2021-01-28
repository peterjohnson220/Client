import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Workbook } from 'libs/features/surveys/reports/models';


@Component({
  selector: 'pf-standard-report',
  templateUrl: './standard-report.component.html',
  styleUrls: ['./standard-report.component.scss']
})
export class StandardReportComponent {
  @Input() workbook: Workbook;

  displayOverlay: boolean;

  constructor(private router: Router) {
  }

  handleReportPreviewClicked(): void {
    this.router.navigate(
      [this.workbook.SourceUrl, this.workbook.WorkbookId],
      {queryParams: {showTabs: this.workbook.ShowTabs, title: this.workbook.WorkbookName}}
    ).then(r => {});
  }
}
