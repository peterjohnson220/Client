import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { ActionsSubject, Store } from '@ngrx/store';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { ofType } from '@ngrx/effects';

import { AsyncStateObj, CompanySettingsEnum, GenericKeyValue, PayMarket, UserContext } from 'libs/models';
import { PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import cloneDeep from 'lodash/cloneDeep';
import { PricingProjectHelperService } from 'libs/core';
import { ModifyPricingsSearchContext, SearchContextType } from 'libs/features/surveys/survey-search/models';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';
import { SurveySearchFilterMappingDataObj, SurveySearchUserFilterType } from 'libs/features/surveys/survey-search/data';
import { AddDataFeatureImplementations } from 'libs/features/pricings/add-data/models';
import { Permissions } from 'libs/constants/permissions';
import { SurveySearchFiltersHelper } from 'libs/features/surveys/survey-search/helpers';
import { AbstractJobInsightsComponent, JobInsightsMode } from 'libs/features/jobs/job-insights/models';
import * as fromRootState from 'libs/state/state';
import * as fromJobManagementActions from 'libs/features/jobs/job-management/actions';
import * as fromSearchPageActions from 'libs/features/search/search/actions/search-page.actions';
import * as fromSearchFeatureActions from 'libs/features/search/search/actions/search-feature.actions';
import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';
import * as fromJobInsightsReducer from 'libs/features/jobs/job-insights/reducers';
import { JobPricingBaseGraphComponent } from 'libs/features/pricings/job-pricing-graph/containers/job-pricing-base-graph/job-pricing-base-graph.component';
import { JobPricingTccGraphComponent } from 'libs/features/pricings/job-pricing-graph/containers/job-pricing-tcc-graph/job-pricing-tcc-graph.component';

import * as fromJobsPageReducer from '../../../../reducers';
import { MarketDataJobPricing } from '../../../../models';

@Component({
  selector: 'pf-job-insights',
  templateUrl: './job-insights.component.html',
  styleUrls: ['./job-insights.component.scss']
})
export class JobInsightsComponent extends AbstractJobInsightsComponent implements OnChanges, OnInit, OnDestroy {
  @Input() filters: PfDataGridFilter[];

  payMarkets$: Observable<PayMarket[]>;
  jobCustomFieldsAsync$: Observable<AsyncStateObj<GenericKeyValue<string, string>[]>>;

  forkJoinSubscription: Subscription;
  jobCustomFieldsAsyncSubscription: Subscription;
  saveJobSuccessSubscription: Subscription;
  companySettingsSubscription: Subscription;

  modifyPricingFeatureImplementation = AddDataFeatureImplementations.MODIFY_PRICINGS;
  permissions = Permissions;
  jobInsightsEditMode = JobInsightsMode.Edit;

  payMarkets: PayMarket[];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  isJobCustomFieldsLoaded: boolean;
  jobPricing: MarketDataJobPricing;
  restrictSurveySearchToPaymarketCountry: boolean;
  @ViewChild(JobPricingBaseGraphComponent) BaseGraph: JobPricingBaseGraphComponent;
  @ViewChild(JobPricingTccGraphComponent) TCCGraph: JobPricingTccGraphComponent;

  constructor(
    private store: Store<fromJobsPageReducer.State>,
    protected rootStore: Store<fromRootState.State>,
    private actionsSubject: ActionsSubject,
    private pricingProjectHelperService: PricingProjectHelperService,
    protected jobInsightsMainStore: Store<fromJobInsightsReducer.State>
  ) {
    super(jobInsightsMainStore, rootStore);
    this.payMarkets$ = this.store.select(fromJobsPageReducer.getCompanyPayMarkets);
    this.jobCustomFieldsAsync$ = this.store.select(fromJobInsightsReducer.getJobCustomFields);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.forkJoinSubscription = forkJoin([this.getPayMarketsLoaded(), this.getUserContextLoaded()])
      .subscribe(([payMarkets, userContext]) => {
        this.companyPayMarketId = userContext?.DefaultPayMarketId
          ? userContext.DefaultPayMarketId
          : payMarkets?.length ? payMarkets[0].CompanyPayMarketId : null;
        this.payMarkets = cloneDeep(payMarkets);
        this.loadJobCustomFields(userContext.CompanyId);
      });
    this.jobCustomFieldsAsyncSubscription = this.jobCustomFieldsAsync$.subscribe((asyncObj) => {
      if (!asyncObj?.loading && asyncObj.obj) {
        this.companyJobCustomFields = asyncObj.obj;
        this.isJobCustomFieldsLoaded = true;
        this.loadJobInsights();
      }
    });
    this.saveJobSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromJobManagementActions.SAVE_COMPANY_JOB_SUCCESS))
      .subscribe(() => {
        this.loadJobInsights();
      });
    this.companySettingsSubscription = this.store.select(fromRootState.getCompanySettings).subscribe(cs => {
      if (cs) {
        this.restrictSurveySearchToPaymarketCountry = cs.find(x => x.Key === CompanySettingsEnum.RestrictSurveySearchCountryFilterToPayMarket).Value === 'true';
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']?.currentValue) {
      const companyJobIdFilter: PfDataGridFilter = this.filters.find(i => i.SourceName === 'CompanyJob_ID');
      if (companyJobIdFilter?.Values?.length > 0) {
        this.companyJobId = <any>companyJobIdFilter.Values[0] as number;
        if (this.isJobCustomFieldsLoaded) {
          this.loadJobInsights();
        }
      }
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.forkJoinSubscription.unsubscribe();
    this.jobCustomFieldsAsyncSubscription.unsubscribe();
    this.saveJobSuccessSubscription.unsubscribe();
  }

  handlePayMarketValueChanged(value: number): void {
    this.companyPayMarketId = value;
    this.loadJobInsights();
  }

  handlePricingChanged(): void {
    this.loadJobInsights();
    this.handleMarketDataUpdated();
  }

  handleMarketDataUpdated(): void {
    this.BaseGraph.refreshData();
    this.TCCGraph.refreshData();
  }

  openAddDataModal(): void {
    const selectedPayMarket = this.payMarkets.find(pm => pm.CompanyPayMarketId === this.companyPayMarketId);
    const jobContext = {
      JobTitle: this.jobInsights.Job.JobTitle,
      JobPayMarketId: this.companyPayMarketId,
      CompanyJobId: this.jobInsights.Job.Id,
      JobCode: this.jobInsights.Job.JobCode,
      PricingId: this.jobInsights.JobPricingId
    };
    const searchContext: ModifyPricingsSearchContext = {
      PricingIds: [this.jobInsights.JobPricingId],
      PaymarketId: this.companyPayMarketId,
      CurrencyCode: selectedPayMarket.CurrencyCode,
      CountryCode: selectedPayMarket.CountryCode,
      Rate: this.jobInsights.JobPricingRate
    };

    this.store.dispatch(new fromSearchFeatureActions.SetSearchFeatureId(SearchFeatureIds.AddSurveyData));
    this.store.dispatch(new fromSearchPageActions.SetSearchFilterMappingData(SurveySearchFilterMappingDataObj));
    this.store.dispatch(new fromSearchPageActions.SetUserFilterTypeData(SurveySearchUserFilterType));
    this.pricingProjectHelperService.SetAddDataModalContext(jobContext, searchContext, SearchContextType.Jobs);
    if (this.restrictSurveySearchToPaymarketCountry) {
      this.store.dispatch(new fromSearchFiltersActions.AddFilters([
        SurveySearchFiltersHelper.buildLockedCountryCodeFilter(searchContext.CountryCode, SurveySearchFilterMappingDataObj)
      ]));
    }
  }

  protected handleJobInsightsLoaded(): void {
    super.updateJobDetails();
    const selectedPayMarket = this.payMarkets.find(pm => pm.CompanyPayMarketId === this.companyPayMarketId);
    this.jobPricing = {
      PricingId: this.jobInsights.JobPricingId,
      Rate: this.jobInsights.JobPricingRate,
      JobTitle: this.jobInsights.Job.JobTitle,
      JobCode: this.jobInsights.Job.JobCode,
      JobId: this.jobInsights.Job.Id,
      PayMarket: selectedPayMarket.PayMarket,
      PayMarketId: selectedPayMarket.CompanyPayMarketId,
      EffectiveDate: this.jobInsights.JobPricingEffectiveDate,
      LinkedPayMarketName: this.jobInsights.LinkedPayMarketName
    };
  }

  private getPayMarketsLoaded(): Observable<PayMarket[]> {
    return this.payMarkets$.pipe(
      filter(f => !!f && f.length > 0),
      take(1)
    );
  }

  private getUserContextLoaded(): Observable<UserContext> {
    return this.userContext$.pipe(
      filter(f => !!f),
      take(1)
    );
  }
}
