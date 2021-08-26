import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models';
import { EmployeeInsights, EmployeeTotalRewardsLite } from 'libs/models/payfactors-api/employees';

import * as fromEmployeesMainReducer from '../../reducers';
import { EmployeeTotalRewardsHelper } from '../../helpers';

@Component({
  selector: 'pf-total-rewards-tab-content',
  templateUrl: './total-rewards-tab-content.component.html',
  styleUrls: ['./total-rewards-tab-content.component.scss']
})
export class TotalRewardsTabContentComponent implements OnInit, OnDestroy {
  employeeInsightsAsync$: Observable<AsyncStateObj<EmployeeInsights>>;

  employeeInsightsAsyncSubscription: Subscription;

  employeeTotalRewardsLite: EmployeeTotalRewardsLite;

  constructor(
    private store: Store<fromEmployeesMainReducer.State>
  ) {
    this.employeeInsightsAsync$ = this.store.select(fromEmployeesMainReducer.getEmployeeInsights);
  }

  ngOnInit(): void {
    this.employeeInsightsAsyncSubscription = this.employeeInsightsAsync$.subscribe((asyncObj) => {
      if (!asyncObj?.loading && asyncObj.obj) {
        this.employeeTotalRewardsLite = EmployeeTotalRewardsHelper.mapEmployeeInsightsToEmployeeTotalRewardsLite(asyncObj.obj);
      }
    });
  }

  ngOnDestroy(): void {
    this.employeeInsightsAsyncSubscription.unsubscribe();
  }
}
