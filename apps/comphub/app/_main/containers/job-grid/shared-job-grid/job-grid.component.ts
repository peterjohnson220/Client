import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SortDescriptor } from '@progress/kendo-data-query';

import { JobData, JobGridData, QuickPriceGridColumn } from '../../../models';
import { DataCardHelper } from '../../../helpers';

@Component({
  selector: 'pf-comphub-job-grid',
  templateUrl: './job-grid.component.html',
  styleUrls: ['./job-grid.component.scss']
})
export class JobGridComponent {
  @Input() jobTitle: string;
  @Input() jobGridData: JobGridData;
  @Input() gridHasData: boolean;
  @Input() gridColumnsConfiguration: QuickPriceGridColumn[];
  @Input() loading: boolean;
  @Input() loadingError: boolean;
  @Input() selectedJobData: JobData;
  @Input() currencyCode: string;

  @Output() sortChanged: EventEmitter<any> = new EventEmitter();
  @Output() selectionChanged: EventEmitter<JobData> = new EventEmitter();
  @Output() jobDescriptionToggled: EventEmitter<number> = new EventEmitter();
  @Output() loadMoreClicked: EventEmitter<any> = new EventEmitter();

  pageSize = 5;
  gridContext = {
    skip: 0,
    take: this.pageSize,
    sortBy: null
  };
  firstDayOfMonth: Date;

  constructor() {
    this.firstDayOfMonth = DataCardHelper.firstDayOfMonth();
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

  handleSelectionChanged(job: JobData) {
    this.selectionChanged.emit(job);
  }

  handleExpandJdClicked(clickEvent: MouseEvent, jobId: number) {
    clickEvent.stopPropagation();
    this.jobDescriptionToggled.emit(jobId);
  }

  handleLoadMore(): void {
    if (!this.jobGridData?.Data?.length) {
      return;
    }
    this.gridContext.skip = this.jobGridData.Data.length;
    this.loadMoreClicked.emit(this.gridContext);
  }

  resetGridContext(): void {
    this.gridContext = {
      skip: 0,
      take: this.pageSize,
      sortBy: null
    };
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
