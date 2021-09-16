import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models';
import { EmployeeInsights, EmployeeTotalRewardsLite } from 'libs/models/payfactors-api/employees';
import { AbstractFeatureFlagService, FeatureFlags, PermissionService, RealTimeFlag } from 'libs/core';
import { StatementModeEnum } from 'libs/features/total-rewards/total-rewards-statement/models';
import { EmployeeRewardsData } from 'libs/models/payfactors-api';
import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';
import { PermissionCheckEnum, Permissions } from 'libs/constants';

import * as fromEmployeesMainReducer from '../../reducers';
import { EmployeeTotalRewardsHelper } from '../../helpers';

@Component({
  selector: 'pf-total-rewards-tab-content',
  templateUrl: './total-rewards-tab-content.component.html',
  styleUrls: ['./total-rewards-tab-content.component.scss']
})
export class TotalRewardsTabContentComponent implements OnInit, OnDestroy {
  @Input() employeeName: string;
  employeeInsightsAsync$: Observable<AsyncStateObj<EmployeeInsights>>;

  employeeInsightsAsyncSubscription: Subscription;

  employeeTotalRewardsLite: EmployeeTotalRewardsLite;
  totalRewardsStatementMode = StatementModeEnum.Print;
  statement: Statement;
  employeeRewardsData: EmployeeRewardsData;
  totalRewardsAdditionalPageFeatureFlag: RealTimeFlag = { key: FeatureFlags.TotalRewardsAdditionalPage, value: false};
  permissions = Permissions;
  unsubscribe$ = new Subject<void>();
  hasTotalRewardsAccess: boolean;
  showPaidTotalRewardsVersion: boolean;

  constructor(
    private store: Store<fromEmployeesMainReducer.State>,
    private featureFlagService: AbstractFeatureFlagService,
    private permissionService: PermissionService
  ) {
    this.employeeInsightsAsync$ = this.store.select(fromEmployeesMainReducer.getEmployeeInsights);
    this.featureFlagService.bindEnabled(this.totalRewardsAdditionalPageFeatureFlag, this.unsubscribe$);
  }

  ngOnInit(): void {
    this.hasTotalRewardsAccess = this.permissionService.CheckPermission([Permissions.TOTAL_REWARDS], PermissionCheckEnum.Single);
    this.employeeInsightsAsyncSubscription = this.employeeInsightsAsync$.subscribe((asyncObj) => {
      if (!asyncObj?.loading && asyncObj.obj) {
        this.showPaidTotalRewardsVersion = false;
        this.employeeTotalRewardsLite = EmployeeTotalRewardsHelper.mapEmployeeInsightsToEmployeeTotalRewardsLite(asyncObj.obj);
        if (asyncObj?.obj?.TotalRewardsStatement && asyncObj?.obj?.EmployeeRewardsData) {
          this.statement = asyncObj.obj.TotalRewardsStatement;
          this.employeeRewardsData = asyncObj.obj.EmployeeRewardsData;
          this.showPaidTotalRewardsVersion = true;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.employeeInsightsAsyncSubscription.unsubscribe();
  }
}
