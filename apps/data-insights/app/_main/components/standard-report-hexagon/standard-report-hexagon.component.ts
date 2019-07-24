import { Component, Input } from '@angular/core';

import { Workbook } from '../../models';

@Component({
  selector: 'pf-standard-report-hexagon',
  templateUrl: './standard-report-hexagon.component.html',
  styleUrls: ['./standard-report-hexagon.component.scss']
})
export class StandardReportHexagonComponent {
  @Input() workbook: Workbook;
  @Input() showOverlay: boolean;

  constructor() {}
}
