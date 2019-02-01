import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { PopupSettings } from '@progress/kendo-angular-dropdowns';

import * as fromCompHubPageActions from '../../../actions/comphub-page.actions';
import * as fromJobsCardActions from '../../../actions/jobs-card.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { TrendingJobGroup } from '../../../models';

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

  jobSearchOptionsSub: Subscription;

  potentialOptions: string[];
  currentSearchValue: string;

  constructor(
    private store: Store<fromComphubMainReducer.State>
  ) {
    this.potentialOptions = [];
    this.trendingJobGroups$ = this.store.select(fromComphubMainReducer.getTrendingJobGroups);
    this.jobSearchOptions$ = this.store.select(fromComphubMainReducer.getJobSearchOptions);
    this.loadingJobSearchOptions$ = this.store.select(fromComphubMainReducer.getLoadingJobSearchOptions);
    this.selectedJob$ = this.store.select(fromComphubMainReducer.getSelectedJob);
    this.popupSettings = {
      appendTo: 'component'
    };
  }

  ngOnInit() {
    this.store.dispatch(new fromJobsCardActions.GetTrendingJobs());
    this.jobSearchOptionsSub = this.jobSearchOptions$.subscribe(o => this.potentialOptions = o);
  }

  handleJobSearchFilterChange(searchTerm: string): void {
    this.store.dispatch(new fromJobsCardActions.GetJobSearchOptions(searchTerm));
    if (!searchTerm) {
      this.handleJobSearchValueChanged(searchTerm);
    }
  }

  handleJobSearchValueChanged(selectedTerm: string): void {
    if (!selectedTerm || this.potentialOptions.some(x => x.toLowerCase() === selectedTerm.toLowerCase())) {
      this.store.dispatch(new fromJobsCardActions.SetSelectedJob(selectedTerm));
    }
  }

  handleTrendingJobClicked(trendingJob: string) {
    this.currentSearchValue = trendingJob;
    this.store.dispatch(new fromJobsCardActions.SetSelectedJob(trendingJob));
    this.store.dispatch(new fromCompHubPageActions.NavigateToNextCard());
  }

  ngOnDestroy(): void {
    this.jobSearchOptionsSub.unsubscribe();
  }
}
