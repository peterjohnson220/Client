import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { ActionsSubject, Store } from '@ngrx/store';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { ofType } from '@ngrx/effects';

import { AsyncStateObj, CompanySettingsEnum, GenericKeyValue, PayMarket, UserContext } from 'libs/models';
import { PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import cloneDeep from 'lodash/cloneDeep';
import { MULTIPLE_JOB_DESCRIPTIONS, PricingProjectHelperService } from 'libs/core';
import { JobInsights } from 'libs/models/payfactors-api';
import { ModifyPricingsSearchContext, SearchContextType } from 'libs/features/surveys/survey-search/models';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';
import { SurveySearchFilterMappingDataObj, SurveySearchUserFilterType } from 'libs/features/surveys/survey-search/data';
import { AddDataFeatureImplementations } from 'libs/features/pricings/add-data/models';
import { Permissions } from 'libs/constants/permissions';
import * as fromRootState from 'libs/state/state';
import * as fromJobManagementActions from 'libs/features/jobs/job-management/actions';
import * as fromSearchPageActions from 'libs/features/search/search/actions/search-page.actions';
import * as fromSearchFeatureActions from 'libs/features/search/search/actions/search-feature.actions';
import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';

import * as fromJobsPageReducer from '../../../../reducers';
import * as fromJobInsightsActions from '../../../../actions/job-insights.actions';
import { JobInsightsHelper, MarketDataJobPricing } from '../../../../models';
import { SurveySearchFiltersHelper } from 'libs/features/surveys/survey-search/helpers';

@Component({
  selector: 'pf-job-insights',
  templateUrl: './job-insights.component.html',
  styleUrls: ['./job-insights.component.scss']
})
export class JobInsightsComponent implements OnChanges, OnInit, OnDestroy {
  @Input() filters: PfDataGridFilter[];

  jobInsightsAsync$: Observable<AsyncStateObj<JobInsights>>;
  userContext$: Observable<UserContext>;
  payMarkets$: Observable<PayMarket[]>;
  jobCustomFieldsAsync$: Observable<AsyncStateObj<GenericKeyValue<string, string>[]>>;

  forkJoinSubscription: Subscription;
  jobInsightsAndCustomFieldsSubscription: Subscription;
  jobInsightsAsyncSubscription: Subscription;
  saveJobSuccessSubscription: Subscription;
  companySettingsSubscription: Subscription;

  multipleJobDescriptions = MULTIPLE_JOB_DESCRIPTIONS;
  modifyPricingFeatureImplementation = AddDataFeatureImplementations.MODIFY_PRICINGS;
  permissions = Permissions;
  payMarkets: PayMarket[];
  selectedPayMarketId: number;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  companyJobId: number;
  jobInsights: JobInsights;
  isJobInsightsInitialized: boolean;
  isViewMore: boolean;
  standardFields: GenericKeyValue<string, string>[];
  customFields: GenericKeyValue<string, string>[];
  allCustomFields: GenericKeyValue<string, string>[];
  jobPricing: MarketDataJobPricing;
  restrictSurveySearchToPaymarketCountry: boolean;

  constructor(
    private store: Store<fromJobsPageReducer.State>,
    private rootStore: Store<fromRootState.State>,
    private actionsSubject: ActionsSubject,
    private pricingProjectHelperService: PricingProjectHelperService
  ) {
    this.jobInsightsAsync$ = this.store.select(fromJobsPageReducer.getJobInsights);
    this.userContext$ = this.rootStore.select(fromRootState.getUserContext);
    this.payMarkets$ = this.store.select(fromJobsPageReducer.getCompanyPayMarkets);
    this.jobCustomFieldsAsync$ = this.store.select(fromJobsPageReducer.getJobCustomFields);
  }

  ngOnInit(): void {
    this.forkJoinSubscription = forkJoin([this.getPayMarketsLoaded(), this.getUserContextLoaded()])
      .subscribe(([payMarkets, userContext]) => {
        this.selectedPayMarketId = userContext?.DefaultPayMarketId
          ? userContext.DefaultPayMarketId
          : payMarkets?.length ? payMarkets[0].CompanyPayMarketId : null;
        this.payMarkets = cloneDeep(payMarkets);
        this.loadJobCustomFields(userContext.CompanyId);
        this.loadJobInsights();
      });
    this.jobInsightsAndCustomFieldsSubscription = forkJoin([this.getJobInsightsLoaded(), this.getCustomFieldsLoaded()])
      .subscribe(([jobInsightsAsync, customFieldsAsync]) => {
        this.allCustomFields = customFieldsAsync.obj;
        this.updateJobDetails(jobInsightsAsync.obj, customFieldsAsync.obj);
        this.isJobInsightsInitialized = true;
      });
    this.jobInsightsAsyncSubscription = this.jobInsightsAsync$.subscribe(asyncObj => {
      if (!asyncObj?.loading && asyncObj.obj && this.isJobInsightsInitialized) {
        this.updateJobDetails(asyncObj.obj, this.allCustomFields);
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
        if (this.isJobInsightsInitialized) {
          this.loadJobInsights();
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.forkJoinSubscription.unsubscribe();
    this.jobInsightsAndCustomFieldsSubscription.unsubscribe();
    this.jobInsightsAsyncSubscription.unsubscribe();
    this.saveJobSuccessSubscription.unsubscribe();
  }

  loadJobInsights(): void {
    if (this.companyJobId && this.selectedPayMarketId) {
      this.store.dispatch(new fromJobInsightsActions.LoadJobInsights({
        CompanyJobId: this.companyJobId,
        CompanyPayMarketId: this.selectedPayMarketId
      }));
    }
  }

  handlePayMarketValueChanged(value: number): void {
    this.selectedPayMarketId = value;
    this.loadJobInsights();
  }

  toggleViewMore(): void {
    this.isViewMore = !this.isViewMore;
  }

  openAddDataModal(): void {
    const selectedPayMarket = this.payMarkets.find(pm => pm.CompanyPayMarketId === this.selectedPayMarketId);
    const jobContext = {
      JobTitle: this.jobInsights.Job.JobTitle,
      JobPayMarketId: this.selectedPayMarketId,
      CompanyJobId: this.jobInsights.Job.Id,
      JobCode: this.jobInsights.Job.JobCode,
      PricingId: this.jobInsights.JobPricingId
    };
    const searchContext: ModifyPricingsSearchContext = {
      PricingIds: [this.jobInsights.JobPricingId],
      PaymarketId: this.selectedPayMarketId,
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

  private getJobInsightsLoaded(): Observable<AsyncStateObj<JobInsights>> {
    return this.jobInsightsAsync$.pipe(
      filter(f => !!f?.obj),
      take(1)
    );
  }

  private getCustomFieldsLoaded(): Observable<AsyncStateObj<GenericKeyValue<string, string>[]>> {
    return this.jobCustomFieldsAsync$.pipe(
      filter(f => !!f?.obj),
      take(1)
    );
  }

  private loadJobCustomFields(companyId: number): void {
    this.store.dispatch(new fromJobInsightsActions.LoadCustomJobFields({ companyId }));
  }

  private updateJobDetails(jobInsights: JobInsights, customFields: GenericKeyValue<string, string>[]): void {
    this.jobInsights = jobInsights;
    this.standardFields = JobInsightsHelper.mapJobDataToGenericKeyValues(this.jobInsights.Job);
    this.customFields = JobInsightsHelper.getCustomFieldsWithValues(this.jobInsights.Job, customFields);
    this.isViewMore = false;
    const selectedPayMarket = this.payMarkets.find(pm => pm.CompanyPayMarketId === this.selectedPayMarketId);
    this.jobPricing = {
      PricingId: this.jobInsights.JobPricingId,
      Rate: this.jobInsights.JobPricingRate,
      JobTitle: this.jobInsights.Job.JobTitle,
      JobCode: this.jobInsights.Job.JobCode,
      JobId: this.jobInsights.Job.Id,
      PayMarket: selectedPayMarket.PayMarket,
      PayMarketId: selectedPayMarket.CompanyPayMarketId,
      EffectiveDate: this.jobInsights.JobPricingEffectiveDate,
      LinkedPayMarketName: jobInsights.LinkedPayMarketName
    };
  }
}
