import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';

import { UserContext } from 'libs/models';
import * as fromRootState from 'libs/state/state';

import { EmployeesPageViewId } from '../models';

@Component({
  selector: 'pf-employees-page',
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss']
})
export class EmployeesPageComponent {
  userContext$: Observable<UserContext>;
  pageViewId = EmployeesPageViewId;
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyEmployees_Employee_ID'
  }];

  constructor(
    private store: Store<fromRootState.State>
  ) {
    this.userContext$ = store.select(fromRootState.getUserContext);
  }

  getPageTitle(companyName: string) {
    return companyName ? `${companyName} Employees` : '';
  }
}

