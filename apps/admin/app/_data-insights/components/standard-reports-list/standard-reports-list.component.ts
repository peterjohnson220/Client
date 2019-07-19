import { Component, Input } from '@angular/core';

import { StandardReportDetails } from '../../models';

@Component({
  selector: 'pf-standard-reports-list',
  templateUrl: './standard-reports-list.component.html',
  styleUrls: ['./standard-reports-list.component.scss']
})
export class StandardReportsListComponent {
  @Input() standardReportsList: StandardReportDetails[];
  @Input() loading: boolean;
  @Input() filter: string;

  constructor() { }
}
