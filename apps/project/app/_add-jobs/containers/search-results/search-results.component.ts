import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromSearchReducer from 'libs/features/search/reducers';

import * as fromAddJobsReducer from '../../reducers';
import * as fromSearchResultsActions from '../../actions/search-results.actions';
import { JobResult } from '../../models';

@Component({
  selector: 'pf-job-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent {
  @Input() canSelectJobs: boolean;
  @Input() useSmallBizStyles: boolean;

  jobResults$: Observable<JobResult[]>;
  loadingResults$: Observable<boolean>;
  spinnerType = 'GIF';

  constructor(private store: Store<fromAddJobsReducer.State>) {
    this.jobResults$ = this.store.select(fromAddJobsReducer.getJobs);
    this.loadingResults$ = this.store.select(fromSearchReducer.getLoadingResults);
  }

  handleJobSelectionToggle(job: JobResult): void {
    if (!this.canSelectJobs && !job.IsSelected) {
      // do nothing
    } else {
      this.store.dispatch(new fromSearchResultsActions.ToggleJobSelection(job));
    }
  }

  handleJobDetailClicked(job: JobResult): void {
    this.store.dispatch(new fromSearchResultsActions.ToggleJobDetail(job));
    if (!job.PricingDataLoaded) {
      this.store.dispatch(new fromSearchResultsActions.GetJobPricingData(job));
    }
  }

  trackByJobId(index, item: JobResult) {
    return item.Id;
  }
}
