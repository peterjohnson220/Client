import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { PopupSettings } from '@progress/kendo-angular-dropdowns';

import * as fromJobsPageActions from '../../../actions/jobs-page.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { TrendingJobGroup } from '../../../models/trending-job.model';

@Component({
  selector: 'pf-jobs-page',
  templateUrl: './jobs.page.component.html',
  styleUrls: ['./jobs.page.component.scss']
})
export class JobsPageComponent implements OnInit {
  popupSettings: PopupSettings;

  // Observables
  trendingJobGroups$: Observable<TrendingJobGroup[]>;
  jobSearchOptions$: Observable<string[]>;
  loadingJobSearchOptions$: Observable<boolean>;

  constructor(
    private store: Store<fromComphubMainReducer.State>
  ) {
    this.trendingJobGroups$ = this.store.select(fromComphubMainReducer.getTrendingJobGroups);
    this.jobSearchOptions$ = this.store.select(fromComphubMainReducer.getJobSearchOptions);
    this.loadingJobSearchOptions$ = this.store.select(fromComphubMainReducer.getLoadingJobSearchOptions);
    this.popupSettings = {
      appendTo: 'component'
    };
  }

  ngOnInit() {
    this.store.dispatch(new fromJobsPageActions.GetTrendingJobs());
  }

  handleJobSearchFilterChange(searchTerm: string): void {
    this.store.dispatch(new fromJobsPageActions.GetJobSearchOptions(searchTerm));
  }
}
