import { Component, EventEmitter, Input, Output } from '@angular/core';

import { JobData, JobGridData } from 'libs/models/comphub';

import { QuickPriceGridColumn } from '../../../_shared/models';

@Component({
  selector: 'pf-crowd-sourced-job-grid-content',
  templateUrl: './crowd-sourced-job-grid-content.component.html',
  styleUrls: ['../../../_shared/styles/job-grid-content-style.scss']
})
export class CrowdSourcedJobGridContentComponent {

  @Input() jobGridData: JobGridData;
  @Input() selectedJobData: JobData;
  @Input() gridHasData: boolean;
  @Input() gridColumnsConfiguration: QuickPriceGridColumn[];
  @Input() currencyCode: string;
  @Input() loading: boolean;
  @Input() gridContext: any;

  @Output() selectionChanged: EventEmitter<JobData> = new EventEmitter();
  @Output() jobTasksToggled: EventEmitter<string> = new EventEmitter();

  constructor() { }

  handleSelectionChanged(job: JobData) {
    this.selectionChanged.emit(job);
  }

  handleExpandJobTasks(clickEvent: MouseEvent, jobTitle: string) {
    clickEvent.stopPropagation();
    this.jobTasksToggled.emit(jobTitle);
  }

  trackByFn(index: number, job: JobData) {
    return job.JobTitle;
  }

}
