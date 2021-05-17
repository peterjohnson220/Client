import { Component, Input, OnDestroy, } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromSearchReducer from 'libs/features/search/search/reducers';
import { JobResult } from 'libs/features/jobs/add-jobs/models';
import * as fromSearchResultsActions from 'libs/features/jobs/add-jobs/actions/search-results.actions';
import * as fromAddJobsReducer from 'libs/features/jobs/add-jobs/reducers';
import { GradeRangeGroupDetails } from '../../models';

@Component({
  selector: 'pf-structures-jobs-search-results',
  templateUrl: './structures-search-results.component.html',
  styleUrls: ['./structures-search-results.component.scss']
})
export class StructuresSearchResultsComponent implements OnDestroy {
  @Input() canSelectJobs: boolean;
  @Input() useSmallBizStyles: boolean;
  @Input() customSearchResultsStyle: any;
  @Input() showJobBasedRangesJobMetadata = false;
  @Input() showJobSourceOrTitle = true;
  @Input() isJobRange: boolean;
  @Input() controlPoint: string;
  @Input() rate: string;
  @Input() gradeRangeGroupDetails: GradeRangeGroupDetails;

  jobResults$: Observable<JobResult[]>;
  loadingResults$: Observable<boolean>;
  spinnerType = 'GIF';
  selectedJobsSub: Subscription;
  selectedJobs: JobResult[];

  constructor(private store: Store<fromAddJobsReducer.State>) {
    this.jobResults$ = this.store.select(fromAddJobsReducer.getJobs);
    this.loadingResults$ = this.store.select(fromSearchReducer.getLoadingResults);
    this.selectedJobsSub = this.store.select(fromAddJobsReducer.getSelectedAllLoadedJobs).subscribe(ids => this.selectedJobs = ids);
  }

  handleJobSelectionToggle(job: JobResult): void {
    if (!this.canSelectJobs && !job.IsSelected) {
      // do nothing
    } else {
      this.store.dispatch(new fromSearchResultsActions.ToggleJobSelection(job));
    }
  }

  get selectedJobCount() {
    const selectedJobs = this.selectedJobs.length;
    return selectedJobs;
  }

  handleJobDetailClicked(job: JobResult): void {
    this.store.dispatch(new fromSearchResultsActions.ToggleJobDetail(job));
    if (!job.PricingDataLoaded) {
      this.store.dispatch(new fromSearchResultsActions.GetJobPricingData( {job: job, loadSingleMrp: !this.isJobRange}));
    }
  }

  trackByJobId(index, item: JobResult) {
    return item.Id;
  }

  ngOnDestroy(): void {
    this.selectedJobsSub.unsubscribe();
  }

}
