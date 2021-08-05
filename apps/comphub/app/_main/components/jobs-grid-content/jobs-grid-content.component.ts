import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SortDescriptor } from '@progress/kendo-data-query';

import { JobData, JobGridData } from 'libs/models/comphub';

import { QuickPriceGridColumn } from '../../../_shared/models';

@Component({
  selector: 'pf-jobs-grid-content',
  templateUrl: './jobs-grid-content.component.html',
  styleUrls: ['../../../_shared/styles/job-grid-content-style.scss']
})
export class JobsGridContentComponent {

  @Input() jobGridData: JobGridData;
  @Input() selectedJobData: JobData;
  @Input() gridHasData: boolean;
  @Input() gridColumnsConfiguration: QuickPriceGridColumn[];
  @Input() currencyCode: string;
  @Input() loading: boolean;
  @Input() gridContext: any;

  @Output() selectionChanged: EventEmitter<JobData> = new EventEmitter();
  @Output() jobDescriptionToggled: EventEmitter<number> = new EventEmitter();
  @Output() sortChanged: EventEmitter<any> = new EventEmitter();

  constructor() { }

  handleSelectionChanged(job: JobData) {
    this.selectionChanged.emit(job);
  }

  handleSortChange(field: string): void {
    if (this.isSortSupported(field)) {
      this.gridContext = {
        skip: 0,
        take: this.gridContext.take,
        sortBy: this.updateSortFieldAndDirection(field)
      };
      this.sortChanged.emit(this.gridContext);
    }
  }

  handleExpandJdClicked(clickEvent: MouseEvent, jobId: number) {
    clickEvent.stopPropagation();
    this.jobDescriptionToggled.emit(jobId);
  }

  trackByFn(index: number, job: JobData) {
    return job.JobId;
  }

  private isSortSupported(sortField: string): boolean {
    return this.gridColumnsConfiguration.some(c => c.IsSortable && c.SortField === sortField);
  }

  private updateSortFieldAndDirection(field: string): SortDescriptor {
    if (!this.gridContext.sortBy || this.gridContext.sortBy.field !== field) {
      return {
        field: field,
        dir: 'asc'
      };
    }
    if (this.gridContext.sortBy.dir === 'asc') {
      return {
        field: field,
        dir: 'desc'
      };
    }
    return null;
  }

}

