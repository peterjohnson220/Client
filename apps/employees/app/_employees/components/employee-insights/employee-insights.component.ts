import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionsSubject, Store } from '@ngrx/store';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { ofType } from '@ngrx/effects';

import { AsyncStateObj, GenericKeyValue, UserContext } from 'libs/models';
import { EmployeeInsights } from 'libs/models/payfactors-api/employees/employee-insights.model';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import * as fromEmployeeManagementActions from 'libs/features/employees/employee-management/actions';
import * as fromRootState from 'libs/state/state';

import * as fromEmployeeInsightsActions from '../../actions/employee-insights.actions';
import * as fromEmployeesPageReducer from '../../reducers';
import { EmployeeDetailSections, EmployeesInsightsHelper } from '../../models/employees-insights.helper';
import { EmployeesPageViewId } from '../../models';

@Component({
  selector: 'pf-employee-insights',
  templateUrl: './employee-insights.component.html',
  styleUrls: ['./employee-insights.component.scss']
})
export class EmployeeInsightsComponent implements OnInit, OnDestroy {

  employeeInsightsAsync$: Observable<AsyncStateObj<EmployeeInsights>>;
  selectedRow$: Observable<any>;
  userContext$: Observable<UserContext>;
  customEmployeeFieldsAsync$: Observable<AsyncStateObj<GenericKeyValue<string, string>[]>>;

  employeeInsightsAsyncSubscription: Subscription;
  selectedRowSubscription: Subscription;
  userContextSubscription: Subscription;
  employeeInsightsAndCustomFieldsSubscription: Subscription;
  saveEmployeeSuccessSubscription: Subscription;

  companyEmployeeId: number;
  employeeId: string;
  isEmployeeInsightsInitialized: boolean;
  employeeInsights: EmployeeInsights;
  employeeInformation: GenericKeyValue<string, string>[];
  jobInformation: GenericKeyValue<string, string>[];
  componentsOfPay: GenericKeyValue<string, string>[];
  allowances: GenericKeyValue<string, string>[];
  incentives: GenericKeyValue<string, string>[];
  employeeBenefits: GenericKeyValue<string, string>[];
  customEmployeeFields: GenericKeyValue<string, string>[];
  allCustomEmployeeFields: GenericKeyValue<string, string>[];
  isViewMore: boolean;

  constructor(
    private store: Store<fromEmployeesPageReducer.State>,
    private rootStore: Store<fromRootState.State>,
    private actionsSubject: ActionsSubject
  ) {
    this.userContext$ = this.rootStore.select(fromRootState.getUserContext);
    this.selectedRow$ = this.store.select(fromPfGridReducer.getSelectedRow, EmployeesPageViewId);
    this.employeeInsightsAsync$ = this.store.select(fromEmployeesPageReducer.getEmployeeInsights);
    this.customEmployeeFieldsAsync$ = this.store.select(fromEmployeesPageReducer.getCustomEmployeeFields);
  }

  ngOnInit(): void {
    this.userContextSubscription = this.userContext$.subscribe(uc => {
      if (!!uc) {
        this.loadCustomEmployeeFields(uc.CompanyId);
      }
    });
    this.selectedRowSubscription = this.selectedRow$.subscribe(selectedRow => {
      if (selectedRow) {
        this.companyEmployeeId = selectedRow.CompanyEmployees_CompanyEmployee_ID;
        this.employeeId = selectedRow.CompanyEmployees_Employee_ID;
        this.loadEmployeeInsights();
      }
    });
    this.employeeInsightsAndCustomFieldsSubscription = forkJoin([this.getEmployeeInsightsLoaded(), this.getCustomFieldsLoaded()])
      .subscribe(([employeeInsightsAsync, customFieldsAsync]) => {
        this.allCustomEmployeeFields = customFieldsAsync.obj;
        this.updateEmployeeDetails(employeeInsightsAsync.obj, customFieldsAsync.obj);
        this.isEmployeeInsightsInitialized = true;
      });
    this.employeeInsightsAsyncSubscription = this.employeeInsightsAsync$.subscribe(async => {
      if (!async?.loading && async.obj && this.isEmployeeInsightsInitialized) {
        this.updateEmployeeDetails(async.obj, this.allCustomEmployeeFields);
      }
    });
    this.saveEmployeeSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromEmployeeManagementActions.SAVE_EMPLOYEE_SUCCESS))
      .subscribe(() => {
        this.loadEmployeeInsights();
      });
  }

  ngOnDestroy() {
    this.employeeInsightsAsyncSubscription.unsubscribe();
    this.selectedRowSubscription.unsubscribe();
    this.userContextSubscription.unsubscribe();
    this.employeeInsightsAndCustomFieldsSubscription.unsubscribe();
    this.saveEmployeeSuccessSubscription.unsubscribe();
  }

  toggleViewMore(): void {
    this.isViewMore = !this.isViewMore;
  }

  updateEmployeeDetails(employeeInsights: EmployeeInsights, customFields: GenericKeyValue<string, string>[]): void {
    this.employeeInsights = employeeInsights;
    this.employeeInformation = EmployeesInsightsHelper.mapEmployeeDataToGenericKeyValues(employeeInsights, EmployeeDetailSections.EmployeeInformation);
    this.jobInformation = EmployeesInsightsHelper.mapEmployeeDataToGenericKeyValues(employeeInsights, EmployeeDetailSections.JobInformation);
    this.componentsOfPay = EmployeesInsightsHelper.mapEmployeeDataToGenericKeyValues(employeeInsights, EmployeeDetailSections.ComponentsOfPay);
    this.allowances = EmployeesInsightsHelper.mapEmployeeDataToGenericKeyValues(employeeInsights, EmployeeDetailSections.Allowances);
    this.incentives = EmployeesInsightsHelper.mapEmployeeDataToGenericKeyValues(employeeInsights, EmployeeDetailSections.Incentives);
    this.employeeBenefits = EmployeesInsightsHelper.mapEmployeeBenefitsDataToGenericKeyValues(employeeInsights.EmployeeBenefits);
    this.customEmployeeFields = EmployeesInsightsHelper.getCustomFieldsWithValues(employeeInsights, customFields);
  }

  private loadEmployeeInsights(): void {
    if (this.companyEmployeeId && this.employeeId) {
      this.store.dispatch(new fromEmployeeInsightsActions.GetEmployeeInsights({
        CompanyEmployeeId: this.companyEmployeeId,
        EmployeeId: this.employeeId
      }));
    }
  }

  private loadCustomEmployeeFields(companyId: number): void {
    this.store.dispatch(new fromEmployeeInsightsActions.LoadCustomEmployeeFields(companyId));
  }

  private getEmployeeInsightsLoaded(): Observable<AsyncStateObj<EmployeeInsights>> {
    return this.employeeInsightsAsync$.pipe(
      filter(f => !!f?.obj),
      take(1)
    );
  }

  private getCustomFieldsLoaded(): Observable<AsyncStateObj<GenericKeyValue<string, string>[]>> {
    return this.customEmployeeFieldsAsync$.pipe(
      filter(f => !!f?.obj),
      take(1)
    );
  }
}
