import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { PopupSettings } from '@progress/kendo-angular-dropdowns';

import * as fromJobsPageActions from '../../../actions/jobs-page.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { TrendingJobGroup } from '../../../models';

@Component({
  selector: 'pf-jobs-page',
  templateUrl: './jobs.page.component.html',
  styleUrls: ['./jobs.page.component.scss']
})
export class JobsPageComponent implements OnInit, OnDestroy {
  @Output() navigateToNext: EventEmitter<void> = new EventEmitter<void>();

  popupSettings: PopupSettings;

  // Observables
  trendingJobGroups$: Observable<TrendingJobGroup[]>;
  jobSearchOptions$: Observable<string[]>;
  loadingJobSearchOptions$: Observable<boolean>;

  jobSearchOptionsSub: Subscription;

  potentialOptions: string[];
  selectedJob: string;

  constructor(
    private store: Store<fromComphubMainReducer.State>
  ) {
    this.selectedJob = '';
    this.potentialOptions = [];
    this.trendingJobGroups$ = this.store.select(fromComphubMainReducer.getTrendingJobGroups);
    this.jobSearchOptions$ = this.store.select(fromComphubMainReducer.getJobSearchOptions);
    this.loadingJobSearchOptions$ = this.store.select(fromComphubMainReducer.getLoadingJobSearchOptions);
    this.popupSettings = {
      appendTo: 'component'
    };
  }

  ngOnInit() {
    this.store.dispatch(new fromJobsPageActions.GetTrendingJobs());
    this.jobSearchOptionsSub = this.jobSearchOptions$.subscribe(o => this.potentialOptions = o);
  }

  handleJobSearchFilterChange(searchTerm: string): void {
    this.store.dispatch(new fromJobsPageActions.GetJobSearchOptions(searchTerm));
    if (!searchTerm) {
      this.handleJobSearchValueChanged(searchTerm);
    }
  }

  handleJobSearchValueChanged(selectedTerm: string): void {
    if (!selectedTerm || this.potentialOptions.some(x => x.toLowerCase() === selectedTerm.toLowerCase())) {
      this.selectedJob = selectedTerm;
      this.store.dispatch(new fromJobsPageActions.SetSelectedJob(selectedTerm));
    }
  }

  ngOnDestroy(): void {
    this.jobSearchOptionsSub.unsubscribe();
  }

  nextButtonClicked(): void {
    this.navigateToNext.emit();
  }
}
