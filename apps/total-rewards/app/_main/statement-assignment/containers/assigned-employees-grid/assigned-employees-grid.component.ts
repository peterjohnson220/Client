import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { CompanyEmployee } from 'libs/models/company';
import { select, Store } from '@ngrx/store';

import * as fromStatementAssignmentReducer from '../../reducers';
import * as fromStatementAssignmentActions from '../../actions/statement-assignment.page.actions';

@Component({
  selector: 'pf-assigned-employees-grid',
  templateUrl: './assigned-employees-grid.component.html',
  styleUrls: ['./assigned-employees-grid.component.scss']
})
export class AssignedEmployeesGridComponent implements OnInit {

  assignedEmployeesData$: Observable<CompanyEmployee[]>;
  assignedEmployeesDataLoading$: Observable<boolean>;
  assignedEmployeesDataLoadingError$: Observable<boolean>;

  selectedEmployeeIds$: Observable<number[]>;

  constructor(private store: Store<fromStatementAssignmentReducer.State>) { }

  ngOnInit(): void {
    this.assignedEmployeesData$ = this.store.pipe(select(fromStatementAssignmentReducer.getAssignedEmployees));
    this.assignedEmployeesDataLoading$ = this.store.pipe(select(fromStatementAssignmentReducer.getAssignedEmployeesLoading));
    this.assignedEmployeesDataLoadingError$ = this.store.pipe(select(fromStatementAssignmentReducer.getAssignedEmployeesLoadingError));

    this.selectedEmployeeIds$ = this.store.pipe(select(fromStatementAssignmentReducer.getAssignmentsGridSelectedCompanyEmployeeIds));

    this.store.dispatch(new fromStatementAssignmentActions.GetAssignedEmployees());
  }

  onCheckboxClick(employee: CompanyEmployee) {
    this.store.dispatch(new fromStatementAssignmentActions.ToggleSelectedEmployee({ CompanyEmployeeId: employee.CompanyEmployeeId }));
  }

}
