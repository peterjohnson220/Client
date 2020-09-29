import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AutoCompleteComponent, PopupSettings } from '@progress/kendo-angular-dropdowns';

import * as fromRootReducer from 'libs/state/state';
import * as fromBasicDataGridReducer from 'libs/features/basic-data-grid/reducers';
import { UserContext } from 'libs/models/security';
import { QuickPriceType, SystemUserGroupNames } from 'libs/constants';
import { ExchangeJobSearchOption } from 'libs/models/peer/ExchangeJobSearchOption';
import { AsyncStateObj } from 'libs/models/state';

import * as fromJobsCardActions from '../../../actions/jobs-card.actions';
import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { CountryDataSet, ExchangeDataSet, JobData, JobPricingLimitInfo, QuickPriceHistoryContext, TrendingJobGroup, WorkflowContext } from '../../../models';
import { ComphubPages } from '../../../data';

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
  isPeerQuickPriceType: boolean;

  constructor(
    private store: Store<fromComphubMainReducer.State>,
    private basicGridStore: Store<fromBasicDataGridReducer.State>
  ) {
    this.potentialOptions = [];
    this.trendingJobGroups$ = this.store.select(fromComphubMainReducer.getTrendingJobGroups);
    this.jobSearchOptions$ = this.store.select(fromComphubMainReducer.getJobSearchOptions);
    this.loadingJobSearchOptions$ = this.store.select(fromComphubMainReducer.getLoadingJobSearchOptions);
    this.selectedJob$ = this.store.select(fromComphubMainReducer.getSelectedJob);
    this.jobPricingBlocked$ = this.store.select(fromComphubMainReducer.getJobPricingBlocked);
    this.jobPricingLimitInfo$ = this.store.select(fromComphubMainReducer.getJobPricingLimitInfo);
    this.countryDataSetsLoaded$ = this.store.select(fromComphubMainReducer.getCountryDataSetsLoaded);
    this.countryDataSets$ = this.store.select(fromComphubMainReducer.getCountryDataSets);
    this.loadingTrendingJobs$ = this.store.select(fromComphubMainReducer.getLoadingTrendingJobs);
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
    this.exchangeDataSets$ = this.store.select(fromComphubMainReducer.getExchangeDataSets);
    this.exchangeJobSearchOptions$ = this.store.select(fromComphubMainReducer.getExchangeJobSearchOptions);
    this.workflowContext$ = this.store.select(fromComphubMainReducer.getWorkflowContext);
    this.selectedJobData$ = this.store.select(fromComphubMainReducer.getSelectedJobData);
    this.exchangeDataSetsLoaded$ = this.store.select(fromComphubMainReducer.getExchangeDataSetLoaded);
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
        this.isPeerQuickPriceType = this.workflowContext.quickPriceType === QuickPriceType.PEER;
      }
    });
    this.pricedJobsCount$ = this.basicGridStore.select(fromBasicDataGridReducer.getTotalCount, QuickPriceHistoryContext.gridId);
  }

  handleJobSearchFilterChange(searchTerm: string): void {
    if (searchTerm?.length > 0) {
      this.workflowContext.quickPriceType === QuickPriceType.PEER ?
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
      if (this.jobSearch.value && this.jobSearch.value !== this.selectedJob) {
        this.handleJobSearchValueChanged(this.jobSearch.value);
      }
    }, 0);
  }

  handleTrendingJobClicked(trendingJob: any) {
    const jobTitle = !!trendingJob.Value ? trendingJob.Value : trendingJob;
    if (this.isPeerQuickPriceType) {
      this.store.dispatch(new fromJobsCardActions.SetSelectedJob({jobTitle: jobTitle, exchangeJobId: trendingJob.Key, navigateToNextCard: true}));
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
