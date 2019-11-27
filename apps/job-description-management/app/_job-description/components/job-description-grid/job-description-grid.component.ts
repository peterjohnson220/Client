import {Component, Input, Output, EventEmitter } from '@angular/core';

import { GridDataResult, SelectionEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';

import { ListAreaColumn } from 'libs/models/common';

import { CompanyJobViewListItem } from '../../models';

@Component({
  selector: 'pf-job-description-grid',
  templateUrl: './job-description-grid.component.html',
  styleUrls: ['./job-description-grid.component.scss']
})

export class JobDescriptionGridComponent {
  @Input() gridDataResult: GridDataResult;
  @Input() listAreaColumns: ListAreaColumn[];
  @Input() loading: boolean;
  @Input() gridState: State;
  @Input() isPublic: boolean;

  @Output() navigateToJobDescription = new EventEmitter();
  @Output() openJobDescriptionHistoryModal = new EventEmitter();
  @Output() openNewJobDescriptionModal = new EventEmitter();
  @Output() pageChanged = new EventEmitter();
  @Output() dataStateChanged = new EventEmitter();
  @Output() sortChanged = new EventEmitter();

  public info: any;
  public filterChanged: any;

  handleRowClick(selection: SelectionEvent) {
    if (!selection || (!!selection.selectedRows && selection.selectedRows.length !== 1)) {
      return;
    }
    const companyJobViewListItem: CompanyJobViewListItem = selection.selectedRows[0].dataItem;
    selection.selectedRows = [];
    this.navigateToJobDescription.emit(companyJobViewListItem);
  }

  handleJobDescriptionHistoryClick(jobDescriptionId: number, jobTitle: string) {
    this.openJobDescriptionHistoryModal.emit({ jobDescriptionId: jobDescriptionId, jobTitle: jobTitle });
  }

  handleNewJobDescriptionClick(companyJobViewListItem: CompanyJobViewListItem) {
    this.openNewJobDescriptionModal.emit(companyJobViewListItem);
  }
}
