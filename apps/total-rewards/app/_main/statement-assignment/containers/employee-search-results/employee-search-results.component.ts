import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { EmployeeSearchResult } from 'libs/models/payfactors-api/employee-search/response/employee-search-response.model';

import * as fromStatementAssignmentsReducers from '../../reducers';


@Component({
  selector: 'pf-employee-search-results',
  templateUrl: './employee-search-results.component.html',
  styleUrls: ['./employee-search-results.component.scss']
})
export class EmployeeSearchResultsComponent {

  // Observables
  employeeResults$: Observable<EmployeeSearchResult[]>;
  loadingResults$: Observable<boolean>;

  constructor(private store: Store<fromStatementAssignmentsReducers.State>) {
    this.employeeResults$ = this.store.select(fromStatementAssignmentsReducers.getEmployees);
  }

}
