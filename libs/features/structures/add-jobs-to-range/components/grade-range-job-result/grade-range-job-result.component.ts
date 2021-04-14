import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { JobResult } from 'libs/features/jobs/add-jobs/models';

import * as fromAddJobsReducer from '../../../../jobs/add-jobs/reducers';

@Component({
  selector: 'pf-grade-range-job-result',
  templateUrl: './grade-range-job-result.component.html',
  styleUrls: ['./grade-range-job-result.component.scss']
})
export class GradeRangeJobResultComponent implements OnDestroy {
  @Input() jobResults: JobResult[];
  @Input() controlPoint: string;
  @Output() jobClicked: EventEmitter<JobResult> = new EventEmitter<JobResult>();
  @Output() jobDetailClicked: EventEmitter<JobResult> = new EventEmitter<JobResult>();

  selectedJobsSub: Subscription;
  selectedJobs: JobResult[];
  gridView: GridDataResult;
  sort: SortDescriptor[];
  sortable = {
    allowUnsort: true,
    mode: 'multiple'
  };

  constructor(
    private store: Store<fromAddJobsReducer.State>
  ) {
    this.selectedJobsSub = this.store.select(fromAddJobsReducer.getSelectedAllLoadedJobs).subscribe(ids => this.selectedJobs = ids);
  }

  get selectedJobCount() {
    const selectedJobs = this.selectedJobs.length;
    return selectedJobs;
  }

  toggleJobSelection(job: JobResult): void {
    this.jobClicked.emit(job);
  }

  trackByJobId(index, item: JobResult) {
    return item.Id;
  }

  ngOnDestroy(): void {
    this.selectedJobsSub.unsubscribe();
  }
}
