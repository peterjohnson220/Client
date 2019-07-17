import { Component, Input, OnInit } from '@angular/core';

import { StandardReportDetails } from '../../models';

@Component({
  selector: 'pf-standard-reports-list',
  templateUrl: './standard-reports-list.component.html',
  styleUrls: ['./standard-reports-list.component.scss']
})
export class StandardReportsListComponent implements OnInit {
  @Input() standardReportsList: StandardReportDetails[];
  @Input() loading: boolean;
  @Input() filter: string;

  constructor() { }

  ngOnInit() { }
}
