import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { GridDataResult, RowArgs, SelectableSettings } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

import { JobResult } from 'libs/features/jobs/add-jobs/models';

@Component({
  selector: 'pf-grade-range-job-result',
  templateUrl: './grade-range-job-result.component.html',
  styleUrls: ['./grade-range-job-result.component.scss']
})
export class GradeRangeJobResultComponent {
  @Input() jobResults: JobResult[];
  @Input() controlPoint: string;
  @Output() jobClicked: EventEmitter<JobResult> = new EventEmitter<JobResult>();
  @Output() jobDetailClicked: EventEmitter<JobResult> = new EventEmitter<JobResult>();

  gridView: GridDataResult;
  sort: SortDescriptor[];
  sortable = {
    allowUnsort: true,
    mode: 'multiple'
  };

  constructor() {
  }

  get selectedJobCount() {
    const selectedJobs = this.jobResults.filter(jr => jr.IsSelected).length;
    return selectedJobs;
  }

  toggleJobSelection(job: JobResult): void {
    this.jobClicked.emit(job);
  }

  trackByJobId(index, item: JobResult) {
    return item.Id;
  }

}
