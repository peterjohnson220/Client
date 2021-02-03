import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  handleJobClicked(jobResult): void {
    this.jobClicked.emit(jobResult);
  }

  trackByJobId(index, item: JobResult) {
    return item.Id;
  }

}
