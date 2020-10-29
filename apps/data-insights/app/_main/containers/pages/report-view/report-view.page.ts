import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ReportViewTypes } from 'libs/features/reports/models';

@Component({
  selector: 'pf-report-view-page',
  templateUrl: './report-view.page.html',
  styleUrls: ['./report-view.page.scss']
})
export class ReportViewPageComponent {
  reportTitle: string;
  workbookId: string;
  workbookName: string;
  viewName: string;
  viewType: ReportViewTypes;

  constructor(private route: ActivatedRoute) {
    this.reportTitle = this.route.snapshot.queryParamMap.get('title');
    this.workbookId = this.route.snapshot.params.workbookId;
    this.viewName = this.route.snapshot.params.viewName;
    this.viewType = this.route.snapshot.data.viewType;
    this.workbookName = this.route.snapshot.params.workbookName;
  }
}
