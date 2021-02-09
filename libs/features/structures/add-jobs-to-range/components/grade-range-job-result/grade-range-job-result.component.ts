import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { GridDataResult, RowArgs, SelectableSettings } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import cloneDeep from 'lodash/cloneDeep';

import { JobResult } from 'libs/features/jobs/add-jobs/models';

@Component({
  selector: 'pf-grade-range-job-result',
  templateUrl: './grade-range-job-result.component.html',
  styleUrls: ['./grade-range-job-result.component.scss']
})
export class GradeRangeJobResultComponent implements OnChanges {
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
  selectableSettings: SelectableSettings;
  selectedRows: any[];
  selectedJob: JobResult;

  constructor() {
    this.selectableSettings = {
      mode: 'multiple'
    };
    this.selectedRows = [];
  }

  handleSelectionChange(event) {
    let selectedRowsNew;
    let deselectedJobCode;
    if (event.selectedRows?.length) {
      this.selectedRows.push(event.selectedRows[0].dataItem.Code);
      this.selectedJob = cloneDeep(this.jobResults.find(x => x.Code === event.selectedRows[0].dataItem.Code));
      this.selectedJob.IsSelected = true;
    } else {
      selectedRowsNew = event.deselectedRows.filter( x => this.selectedRows.includes(x.dataItem.Code));
      deselectedJobCode = this.selectedRows.find(x => !selectedRowsNew.find(row => row.dataItem.Code === x));
      this.selectedRows = selectedRowsNew.map(function(row) {
        return row.dataItem.Code;
      });
      this.selectedJob = cloneDeep(this.jobResults.find(x => x.Code === deselectedJobCode));
      this.selectedJob.IsSelected = false;
    }
    this.handleJobClicked();
  }

  handleJobClicked(): void {
    this.jobClicked.emit(this.selectedJob);
  }

  trackByJobId(index, item: JobResult) {
    return item.Id;
  }

  sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.gridView = {
      data: orderBy(this.jobResults, this.sort),
      total: this.jobResults.length
    };
  }

  loadJobs() {
    this.gridView = {
      data: this.jobResults,
      total: this.jobResults.length
    };
  }

  public isRowSelected = (e: RowArgs) => this.selectedRows.length ? this.selectedRows.indexOf(e.dataItem.Code) >= 0 : false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.jobResults) {
      this.loadJobs();
    }
  }

}
