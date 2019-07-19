import { Component, Input } from '@angular/core';

import { StandardReport } from '../../models';

@Component({
  selector: 'pf-standard-report',
  templateUrl: './standard-report.component.html',
  styleUrls: ['./standard-report.component.scss']
})
export class StandardReportComponent {
  @Input() report: StandardReport;

  constructor() {}
}
