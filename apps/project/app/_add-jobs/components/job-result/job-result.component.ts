import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { JobResult } from '../../models/job-result.model';

@Component({
  selector: 'pf-add-job-result',
  templateUrl: './job-result.component.html',
  styleUrls: ['./job-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobResultComponent {
  @Input() job: JobResult;
  @Output() jobClicked: EventEmitter<JobResult> = new EventEmitter<JobResult>();
  @Output() jobDetailClicked: EventEmitter<JobResult> = new EventEmitter<JobResult>();

  get toggleJobDetailLabel() {
    return (this.job.ShowJobDetail ? 'Hide' : 'Show') + ' Job Detail';
  }

  handleJobClicked(): void {
    this.jobClicked.emit(this.job);
  }

  toggleJobDetailDisplay(e: MouseEvent): void {
    e.stopPropagation();
    this.jobDetailClicked.emit(this.job);
  }
}
