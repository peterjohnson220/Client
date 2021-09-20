import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { AsyncStateObj, GenericKeyValue, UserContext } from 'libs/models';
import { EmployeeInsights } from 'libs/models/payfactors-api/employees/employee-insights.model';
import { EmployeeForSalaryRangeChart } from 'libs/features/employees/employee-salary-range-chart/models';
import { getDefaultChartSettings, JobPricingChartSettings } from 'libs/features/pricings/job-pricing-graph/models';
import { JobPricingBaseGraphComponent } from 'libs/features/pricings/job-pricing-graph/containers';
import * as fromRootState from 'libs/state/state';

import * as fromEmployeeInsightsActions from '../../actions/employee-insights.actions';
import * as fromEmployeesPageReducer from '../../reducers';
import { EmployeeDetailSections, EmployeesInsightsHelper } from '../../models/employees-insights.helper';

@Component({
  selector: 'pf-employee-insights',
  templateUrl: './employee-insights.component.html',
  styleUrls: ['./employee-insights.component.scss']
})
export class EmployeeInsightsComponent implements OnInit, OnDestroy {
  @ViewChild(JobPricingBaseGraphComponent) baseGraph: JobPricingBaseGraphComponent;

  employeeInsightsAsync$: Observable<AsyncStateObj<EmployeeInsights>>;
  userContext$: Observable<UserContext>;
  customEmployeeFieldsAsync$: Observable<AsyncStateObj<GenericKeyValue<string, string>[]>>;

  employeeInsightsAsyncSubscription: Subscription;
  userContextSubscription: Subscription;
  employeeInsightsAndCustomFieldsSubscription: Subscription;

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
  employeeForSalaryRangeChart: EmployeeForSalaryRangeChart;
  chartSettings: JobPricingChartSettings;

  constructor(
    private store: Store<fromEmployeesPageReducer.State>,
    private rootStore: Store<fromRootState.State>
  ) {
    this.userContext$ = this.rootStore.select(fromRootState.getUserContext);
    this.employeeInsightsAsync$ = this.store.select(fromEmployeesPageReducer.getEmployeeInsights);
    this.customEmployeeFieldsAsync$ = this.store.select(fromEmployeesPageReducer.getCustomEmployeeFields);
    this.chartSettings = {
      ...getDefaultChartSettings(),
      MarginLeft: null,
      MarginRight: 30,
      MarginBottom: 75,
      SpacingTop: 50,
      Height: 167,
      ShowPayLabel: false,
      Theme: 'default',
      LabelYPosition: -30,
      TooltipYOffset: -7,
      TooltipXOffset: -5
    };
  }

  ngOnInit(): void {
    this.userContextSubscription = this.userContext$.subscribe(uc => {
      if (!!uc) {
        this.loadCustomEmployeeFields(uc.CompanyId);
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
        if (this.baseGraph) {
          this.baseGraph.refreshData();
        }
      }
    });
  }

  ngOnDestroy() {
    this.employeeInsightsAsyncSubscription.unsubscribe();
    this.userContextSubscription.unsubscribe();
    this.employeeInsightsAndCustomFieldsSubscription.unsubscribe();
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
    this.employeeForSalaryRangeChart = {
      CompanyEmployeeId: this.employeeInsights.Employee.CompanyEmployeeId,
      CompanyJobId: this.employeeInsights.Employee.CompanyJobId,
      CompanyPayMarketId: this.employeeInsights.Employee.CompanyPayMarketId,
      StructureRangeGroupId: this.employeeInsights.StructureRangeGroupId
    };
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
