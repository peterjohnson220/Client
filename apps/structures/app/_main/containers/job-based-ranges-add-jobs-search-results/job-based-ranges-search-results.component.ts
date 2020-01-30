import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromSearchReducer from 'libs/features/search/reducers';
import { JobResult } from 'libs/features/add-jobs/models';

import * as fromStructuresReducer from '../../reducers';
import * as fromSearchResultsActions from '../../actions/job-based-ranges-search-results.actions';

@Component({
  selector: 'pf-job-based-ranges-search-results',
  templateUrl: './job-based-ranges-search-results.component.html',
  styleUrls: ['./job-based-ranges-search-results.component.scss']
})
export class JobBasedRangesSearchResultsComponent {
  @Input() canSelectJobs: boolean;
  @Input() useSmallBizStyles: boolean;

  jobResults$: Observable<JobResult[]>;
  loadingResults$: Observable<boolean>;
  spinnerType = 'GIF';

  constructor(private store: Store<fromStructuresReducer.State>) {
    this.jobResults$ = this.store.select(fromStructuresReducer.getJobs);
    this.loadingResults$ = this.store.select(fromSearchReducer.getLoadingResults);
  }

  handleJobSelectionToggle(job: JobResult): void {
    if (this.canSelectJobs || job.IsSelected) {
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
