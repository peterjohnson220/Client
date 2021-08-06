import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { Permissions } from 'libs/constants';
import * as fromEmployeeManagementActions from 'libs/features/employees/employee-management/actions/employee-management.actions';

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

  permissions = Permissions;
  selectedCompanyEmployeeId: number;

  constructor(
    private store: Store<fromPfGridReducer.State>
  ) {
    this.closeClicked = new EventEmitter();
  }

  ngOnInit() {
    this.selectedRow$ = this.store.select(fromPfGridReducer.getSelectedRow, EmployeesPageViewId);
    this.selectedRowSubscription = this.selectedRow$.subscribe(sr => {
      if (sr) {
        this.selectedCompanyEmployeeId = sr.CompanyEmployees_CompanyEmployee_ID;
      }
    });
  }

  ngOnDestroy() {
    this.selectedRowSubscription.unsubscribe();
  }

  handleEditClicked(): void {
    this.store.dispatch(new fromEmployeeManagementActions.EditEmployee({
      companyEmployeeId: this.selectedCompanyEmployeeId
    }));
  }

  close(): void {
    this.closeClicked.emit();
  }
}
