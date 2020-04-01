import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AutoCompleteComponent, PopupSettings } from '@progress/kendo-angular-dropdowns';

import * as fromRootReducer from 'libs/state/state';
import { UserContext } from 'libs/models/security';
import { CompanyClientTypeConstants, SystemUserGroupNames } from 'libs/constants';
import { ExchangeJobSearchOption } from 'libs/models/peer/ExchangeJobSearchOption';

import * as fromJobsCardActions from '../../../actions/jobs-card.actions';
import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { CountryDataSet, ExchangeDataSet, JobPricingLimitInfo, TrendingJobGroup, WorkflowContext } from '../../../models';
import { ComphubPages } from '../../../data';

@Component({
  selector: 'pf-jobs-card',
  templateUrl: './jobs.card.component.html',
  styleUrls: ['./jobs.card.component.scss']
})
export class JobsCardComponent implements OnInit, OnDestroy {
  @ViewChild('jobSearch', { static: false }) jobSearch: AutoCompleteComponent;
  @ViewChild('exchangeJobSearch', {static: false}) exchangeJobSearch: AutoCompleteComponent;
  @Input() workflowContext: WorkflowContext;

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
  exchangeJobSearchOptions$: Observable<ExchangeJobSearchOption[]>;

  jobSearchOptionsSub: Subscription;
  exchangeJobSearchOptionsSub: Subscription;
  selectedJobSub: Subscription;
  userContextSub: Subscription;

  potentialOptions: string[];
  selectedJob: string;
  userContext: UserContext;
  systemUserGroupNames = SystemUserGroupNames;
  popupSettings: PopupSettings;
  comphubPages = ComphubPages;
  readonly PEER_AND_ANALYSIS = CompanyClientTypeConstants.PEER_AND_ANALYSIS;

  constructor(
    private store: Store<fromComphubMainReducer.State>
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
    this.popupSettings = {
      appendTo: 'component'
    };
  }

  ngOnInit() {
    this.jobSearchOptionsSub = this.jobSearchOptions$.subscribe(o => this.potentialOptions = o);
    this.exchangeJobSearchOptionsSub = this.exchangeJobSearchOptions$.subscribe(o => this.potentialOptions = o.map(x => x.JobTitleShort));
    this.selectedJobSub = this.selectedJob$.subscribe(sj => this.selectedJob = sj);
    this.userContextSub = this.userContext$.subscribe(uc => this.userContext = uc);
  }

  handleJobSearchFilterChange(searchTerm: string): void {
    if (searchTerm) {
        this.userContext.ClientType === CompanyClientTypeConstants.PEER_AND_ANALYSIS ?
        this.store.dispatch(new fromJobsCardActions.GetExchangeJobSearchOptions(searchTerm)) :
        this.store.dispatch(new fromJobsCardActions.GetJobSearchOptions(searchTerm));
    }
  }

  handleJobSearchValueChanged(selectedTerm: string): void {
    if (this.potentialOptions.some(x => x.toLowerCase() === selectedTerm.toLowerCase())) {
      this.store.dispatch(new fromJobsCardActions.SetSelectedJob({jobTitle: selectedTerm }));
    } else if (this.selectedJob) {
      this.store.dispatch(new fromJobsCardActions.ClearSelectedJob());
    }
  }

  handleTrendingJobClicked(trendingJob: string) {
    this.store.dispatch(new fromJobsCardActions.SetSelectedJob({jobTitle: trendingJob, navigateToNextCard: true }));
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
    this.userContextSub.unsubscribe();
  }
}
