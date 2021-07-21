import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AutoCompleteComponent, PopupSettings } from '@progress/kendo-angular-dropdowns';

import * as fromRootReducer from 'libs/state/state';
import * as fromBasicDataGridReducer from 'libs/features/grids/basic-data-grid/reducers';
import { UserContext } from 'libs/models/security';
import { ComphubType, SystemUserGroupNames } from 'libs/constants';
import { ExchangeJobSearchOption } from 'libs/models/peer/ExchangeJobSearchOption';
import { AsyncStateObj } from 'libs/models/state';
import { ExchangeDataSet, JobData } from 'libs/models/comphub';

import * as fromJobsCardActions from '../../../../_shared/actions/jobs-card.actions';
import * as fromComphubPageActions from '../../../../_shared/actions/comphub-page.actions';
import * as fromComphubSharedReducer from '../../../../_shared/reducers';
import { CountryDataSet, QuickPriceHistoryContext, TrendingJobGroup, WorkflowContext } from '../../../../_shared/models';
import { ComphubPages } from '../../../../_shared/data';
import { JobPricingLimitInfo } from '../../../../_shared/models/job-pricing-limit-info.model';

@Component({
  selector: 'pf-jobs-card',
  templateUrl: './jobs.card.component.html',
  styleUrls: ['./jobs.card.component.scss']
})
export class JobsCardComponent implements OnInit, OnDestroy {
  @ViewChild('jobSearch') jobSearch: AutoCompleteComponent;
  @ViewChild('exchangeJobSearch') exchangeJobSearch: AutoCompleteComponent;

  // Observables
  trendingJobGroups$: Observable<TrendingJobGroup[]>;
  jobSearchOptions$: Observable<string[]>;
  loadingJobSearchOptions$: Observable<boolean>;
  selectedJob$: Observable<string>;
  jobPricingBlocked$: Observable<boolean>;
  jobPricingLimitInfo$: Observable<JobPricingLimitInfo>;
  userContext$: Observable<UserContext>;
  countryDataSets$: Observable<CountryDataSet[]>;
  countryDataSetsLoaded$: Observable<boolean>;
  loadingTrendingJobs$: Observable<boolean>;
  exchangeDataSets$: Observable<ExchangeDataSet[]>;
  exchangeDataSetsLoaded$: Observable<boolean>;
  exchangeJobSearchOptions$: Observable<ExchangeJobSearchOption[]>;
  workflowContext$: Observable<WorkflowContext>;
  pricedJobsCount$: Observable<AsyncStateObj<number>>;
  selectedJobData$: Observable<JobData>;

  jobSearchOptionsSub: Subscription;
  exchangeJobSearchOptionsSub: Subscription;
  selectedJobSub: Subscription;
  workflowContextSub: Subscription;

  potentialOptions: string[];
  selectedJob: string;
  userContext: UserContext;
  systemUserGroupNames = SystemUserGroupNames;
  popupSettings: PopupSettings;
  comphubPages = ComphubPages;
  workflowContext: WorkflowContext;
  isPeerComphubType: boolean;

  constructor(
    private store: Store<fromComphubSharedReducer.State>,
    private basicGridStore: Store<fromBasicDataGridReducer.State>
  ) {
    this.potentialOptions = [];
    this.trendingJobGroups$ = this.store.select(fromComphubSharedReducer.getTrendingJobGroups);
    this.jobSearchOptions$ = this.store.select(fromComphubSharedReducer.getJobSearchOptions);
    this.loadingJobSearchOptions$ = this.store.select(fromComphubSharedReducer.getLoadingJobSearchOptions);
    this.selectedJob$ = this.store.select(fromComphubSharedReducer.getSelectedJob);
    this.jobPricingBlocked$ = this.store.select(fromComphubSharedReducer.getJobPricingBlocked);
    this.jobPricingLimitInfo$ = this.store.select(fromComphubSharedReducer.getJobPricingLimitInfo);
    this.countryDataSetsLoaded$ = this.store.select(fromComphubSharedReducer.getCountryDataSetsLoaded);
    this.countryDataSets$ = this.store.select(fromComphubSharedReducer.getCountryDataSets);
    this.loadingTrendingJobs$ = this.store.select(fromComphubSharedReducer.getLoadingTrendingJobs);
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
    this.exchangeDataSets$ = this.store.select(fromComphubSharedReducer.getExchangeDataSets);
    this.exchangeJobSearchOptions$ = this.store.select(fromComphubSharedReducer.getExchangeJobSearchOptions);
    this.workflowContext$ = this.store.select(fromComphubSharedReducer.getWorkflowContext);
    this.selectedJobData$ = this.store.select(fromComphubSharedReducer.getSelectedJobData);
    this.exchangeDataSetsLoaded$ = this.store.select(fromComphubSharedReducer.getExchangeDataSetLoaded);
    this.popupSettings = {
      appendTo: 'component'
    };
  }

  ngOnInit() {
    this.jobSearchOptionsSub = this.jobSearchOptions$.subscribe(o => this.potentialOptions = o);
    this.exchangeJobSearchOptionsSub = this.exchangeJobSearchOptions$.subscribe(o => this.potentialOptions = o.map(x => x.JobTitle));
    this.selectedJobSub = this.selectedJob$.subscribe(sj => this.selectedJob = sj);
    this.workflowContextSub = this.workflowContext$.subscribe(wfc => {
      if (!!wfc) {
        this.workflowContext = wfc;
        this.isPeerComphubType = this.workflowContext.comphubType === ComphubType.PEER;
      }
    });
    this.pricedJobsCount$ = this.basicGridStore.select(fromBasicDataGridReducer.getTotalCount, QuickPriceHistoryContext.gridId);
  }

  handleJobSearchFilterChange(searchTerm: string): void {
    if (searchTerm?.length > 0) {
      this.workflowContext.comphubType === ComphubType.PEER ?
      this.store.dispatch(new fromJobsCardActions.GetExchangeJobSearchOptions(searchTerm)) :
      this.store.dispatch(new fromJobsCardActions.GetJobSearchOptions(searchTerm));
    } else if (this.selectedJob) {
      this.store.dispatch(new fromJobsCardActions.ClearSelectedJob());
    }
  }

  handleJobSearchValueChanged(selectedTerm: string): void {
    if (this.potentialOptions.some(x => x.toLowerCase() === selectedTerm.toLowerCase())) {
      this.store.dispatch(new fromJobsCardActions.SetSelectedJob({jobTitle: selectedTerm }));
    } else if (this.selectedJob) {
      this.store.dispatch(new fromJobsCardActions.ClearSelectedJob());
    }
  }

  handleSearchClosed(): void {
    // after the search is closed, make sure we trigger the job change if there is a mismatch
    setTimeout(() => {
      const searchField = this.isPeerComphubType ? this.exchangeJobSearch : this.jobSearch;
      if (searchField?.value && searchField.value !== this.selectedJob) {
        this.handleJobSearchValueChanged(searchField.value);
      }
    }, 0);
  }

  handleTrendingJobClicked(trendingJob: any) {
    const jobTitle = !!trendingJob.Value ? trendingJob.Value : trendingJob;
    if (this.isPeerComphubType) {
      this.store.dispatch(new fromJobsCardActions.SetSelectedJob({jobTitle: jobTitle, exchangeJobId: trendingJob.Key }));
    } else {
      this.store.dispatch(new fromJobsCardActions.SetSelectedJob({ jobTitle }));
    }
  }

  handleCountryDataSetChanged(countryCode: string) {
    this.jobSearch.reset();
    this.store.dispatch(new fromComphubPageActions.UpdateActiveCountryDataSet(countryCode));
  }

  handleExchangeDataSetChanged(exchangeId: number) {
    this.exchangeJobSearch.reset();
    this.store.dispatch(new fromComphubPageActions.UpdateActiveExchangeDataSet(exchangeId));
  }

  ngOnDestroy(): void {
    this.jobSearchOptionsSub.unsubscribe();
    this.exchangeJobSearchOptionsSub.unsubscribe();
    this.selectedJobSub.unsubscribe();
    this.workflowContextSub.unsubscribe();
  }

  openQuickPriceHistoryModal(): void {
    this.store.dispatch(new fromComphubPageActions.SetQuickPriceHistoryModalOpen(true));
  }
}
