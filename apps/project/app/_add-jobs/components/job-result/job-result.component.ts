import { Component, Input, Output, EventEmitter } from '@angular/core';

import { JobResult } from '../../models/job-result.model';

@Component({
  selector: 'pf-job-result',
  templateUrl: './job-result.component.html',
  styleUrls: ['./job-result.component.scss']
})
export class JobResultComponent {
  @Input() job: JobResult;
  @Output() jobClicked: EventEmitter<JobResult> = new EventEmitter<JobResult>();

  handleJobClicked(): void {
    this.jobClicked.emit(this.job);
  }
}
