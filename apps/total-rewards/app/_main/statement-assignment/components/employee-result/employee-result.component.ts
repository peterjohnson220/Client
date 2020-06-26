import { Component, Input, OnInit } from '@angular/core';

import { EmployeeSearchResult } from 'libs/models/payfactors-api/total-rewards/response/employee-search-response.model';

@Component({
  selector: 'pf-employee-result',
  templateUrl: './employee-result.component.html',
  styleUrls: ['./employee-result.component.scss']
})
export class EmployeeResultComponent implements OnInit {
  @Input() employee: EmployeeSearchResult;

  constructor() { }

  ngOnInit() {
  }

}
