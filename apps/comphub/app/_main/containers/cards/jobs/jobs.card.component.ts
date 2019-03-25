import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AutoCompleteComponent, PopupSettings } from '@progress/kendo-angular-dropdowns';

import * as fromRootReducer from 'libs/state/state';
import { UserContext } from 'libs/models/security';
import { SystemUserGroupNames } from 'libs/constants';

import * as fromJobsCardActions from '../../../actions/jobs-card.actions';
import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { CountryDataSet, JobPricingLimitInfo, TrendingJobGroup } from '../../../models';

@Component({
  selector: 'pf-jobs-card',
  templateUrl: './jobs.card.component.html',
  styleUrls: ['./jobs.card.component.scss']
})
export class JobsCardComponent implements OnInit, OnDestroy {
  popupSettings: PopupSettings;
  @ViewChild('jobSearch') jobSearch: AutoCompleteComponent;

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
  activeCountryDataSet$: Observable<CountryDataSet>;

  jobSearchOptionsSub: Subscription;
  selectedJobSub: Subscription;

  potentialOptions: string[];
  selectedJob: string;
  systemUserGroupNames = SystemUserGroupNames;

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
    this.activeCountryDataSet$ = this.store.select(fromComphubMainReducer.getActiveCountryDataSet);
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
    this.popupSettings = {
      appendTo: 'component'
    };
  }

  ngOnInit() {
    this.jobSearchOptionsSub = this.jobSearchOptions$.subscribe(o => this.potentialOptions = o);
    this.selectedJobSub = this.selectedJob$.subscribe(sj => this.selectedJob = sj);
  }

  handleJobSearchFilterChange(searchTerm: string): void {
    if (searchTerm) {
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

  ngOnDestroy(): void {
    this.jobSearchOptionsSub.unsubscribe();
  }
}
