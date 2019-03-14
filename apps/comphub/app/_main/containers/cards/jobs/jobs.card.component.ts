import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { PopupSettings } from '@progress/kendo-angular-dropdowns';

import * as fromJobsCardActions from '../../../actions/jobs-card.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { JobPricingLimitInfo, TrendingJobGroup } from '../../../models';

@Component({
  selector: 'pf-jobs-card',
  templateUrl: './jobs.card.component.html',
  styleUrls: ['./jobs.card.component.scss']
})
export class JobsCardComponent implements OnInit, OnDestroy {
  popupSettings: PopupSettings;

  // Observables
  trendingJobGroups$: Observable<TrendingJobGroup[]>;
  jobSearchOptions$: Observable<string[]>;
  loadingJobSearchOptions$: Observable<boolean>;
  selectedJob$: Observable<string>;
  jobPricingBlocked$: Observable<boolean>;
  jobPricingLimitInfo$: Observable<JobPricingLimitInfo>;

  jobSearchOptionsSub: Subscription;
  selectedJobSub: Subscription;

  potentialOptions: string[];
  selectedJob: string;

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
    this.popupSettings = {
      appendTo: 'component'
    };
  }

  ngOnInit() {
    this.store.dispatch(new fromJobsCardActions.GetTrendingJobs());
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

  ngOnDestroy(): void {
    this.jobSearchOptionsSub.unsubscribe();
  }
}
