import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EmployeeSearchResult } from 'libs/models/payfactors-api/total-rewards/response/employee-search-response.model';

@Component({
  selector: 'pf-employee-result',
  templateUrl: './employee-result.component.html',
  styleUrls: ['./employee-result.component.scss']
})
export class EmployeeResultComponent {
  @Input() employee: EmployeeSearchResult;

  @Output() employeeClicked: EventEmitter<EmployeeSearchResult> = new EventEmitter<EmployeeSearchResult>();

  constructor() { }

  handleEmployeeClicked() {
    return this.employeeClicked.emit(this.employee);
  }

}
