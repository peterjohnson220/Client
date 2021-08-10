import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { Permissions } from 'libs/constants';
import * as fromEmployeeManagementActions from 'libs/features/employees/employee-management/actions/employee-management.actions';

import * as fromEmployeeInsightsActions from '../../actions/employee-insights.actions';
import { EmployeesPageViewId } from '../../models';

@Component({
  selector: 'pf-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit, OnDestroy {
  @Output() closeClicked: EventEmitter<any>;

  selectedRow$: Observable<any>;

  selectedRowSubscription: Subscription;
  saveEmployeeSuccessSubscription: Subscription;

  permissions = Permissions;
  companyEmployeeId: number;
  employeeId: string;
  employeeTitleName: string;

  constructor(
    private store: Store<fromPfGridReducer.State>,
    private actionsSubject: ActionsSubject
  ) {
    this.selectedRow$ = this.store.select(fromPfGridReducer.getSelectedRow, EmployeesPageViewId);
    this.closeClicked = new EventEmitter();
  }

  ngOnInit() {
    this.selectedRowSubscription = this.selectedRow$.subscribe(sr => {
      if (sr) {
        this.companyEmployeeId = sr.CompanyEmployees_CompanyEmployee_ID;
        this.employeeId = sr.CompanyEmployees_Employee_ID;
        this.employeeTitleName =  this.buildEmployeeTitleName(sr.CompanyEmployees_First_Name, sr.CompanyEmployees_Last_Name, this.employeeId);
        this.loadEmployeeInsights();
      }
    });
    this.saveEmployeeSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromEmployeeManagementActions.SAVE_EMPLOYEE_SUCCESS))
      .subscribe(() => {
        this.loadEmployeeInsights();
      });
  }

  ngOnDestroy() {
    this.selectedRowSubscription.unsubscribe();
    this.saveEmployeeSuccessSubscription.unsubscribe();
  }

  handleEditClicked(): void {
    this.store.dispatch(new fromEmployeeManagementActions.EditEmployee({
      companyEmployeeId: this.companyEmployeeId
    }));
  }

  close(): void {
    this.closeClicked.emit();
  }

  private loadEmployeeInsights(): void {
    if (this.companyEmployeeId && this.employeeId) {
      this.store.dispatch(new fromEmployeeInsightsActions.GetEmployeeInsights({
        CompanyEmployeeId: this.companyEmployeeId,
        EmployeeId: this.employeeId
      }));
    }
  }

  private buildEmployeeTitleName(firstName: string, lastName: string, employeeId: string): string {
    const employeeFirstName = firstName === null ? '' : firstName;
    const employeeLastName = lastName === null ? '' : lastName;
    return employeeFirstName + ' ' + employeeLastName + ' ' + '(' + employeeId + ')';
  }
}
