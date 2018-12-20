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

  handleJobClicked(): void {
    this.jobClicked.emit(this.job);
  }
}
