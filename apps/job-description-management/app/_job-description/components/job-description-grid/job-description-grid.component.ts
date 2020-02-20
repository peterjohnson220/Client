import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { GridDataResult, SelectionEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { ListAreaColumn } from 'libs/models/common';
import { CompanyJobViewListItem } from '../../models';
import { JobDescriptionManagementJobDescriptionState, getJobDescriptionCreating } from '../../reducers';

import { Permissions } from 'libs/constants';
import { JobDescriptionColumn } from '../../constants/job-description-column.constants';

@Component({
  selector: 'pf-job-description-grid',
  templateUrl: './job-description-grid.component.html',
  styleUrls: ['./job-description-grid.component.scss']
})

export class JobDescriptionGridComponent implements OnInit, OnDestroy {
  @Input() gridDataResult: GridDataResult;
  @Input() listAreaColumns: ListAreaColumn[];
  @Input() loading: boolean;
  @Input() loadingError: boolean;
  @Input() gridState: State;
  @Input() isPublic: boolean;
  @Input() canRestrictJobDescriptionFromPublicView: boolean;
  @Output() navigateToJobDescription = new EventEmitter();
  @Output() openJobDescriptionHistoryModal = new EventEmitter();
  @Output() openNewJobDescriptionModal = new EventEmitter();
  @Output() pageChanged = new EventEmitter();
  @Output() dataStateChanged = new EventEmitter();
  @Output() sortChanged = new EventEmitter();
  @Output() publicViewChanged = new EventEmitter();

  public info: any;
  public filterChanged: any;
  public permissions = Permissions;
  public pageableSettings = {
    buttonCount: 5,
    info: this.info,
    type: 'numeric',
    pageSizes: false,
    previousNext: true
  };

  private creatingJobDescription: boolean;
  private creatingJobDescription$: Observable<boolean>;
  private creatingJobDescriptionSubscription: Subscription;

  constructor(
    private store: Store<JobDescriptionManagementJobDescriptionState>
  ) {
    this.creatingJobDescription$ = this.store.select(getJobDescriptionCreating);
  }

  ngOnInit() {
    this.creatingJobDescriptionSubscription = this.creatingJobDescription$.subscribe((creatingJobDescription) => {
      this.creatingJobDescription = creatingJobDescription;
    });
  }

  ngOnDestroy() {
    this.creatingJobDescriptionSubscription.unsubscribe();
  }

  handleRowClick(selection: SelectionEvent) {
    if (!selection || (!!selection.selectedRows && selection.selectedRows.length !== 1)) {
      return;
    }
    const companyJobViewListItem: CompanyJobViewListItem = selection.selectedRows[0].dataItem;
    selection.selectedRows = [];
    if (!this.creatingJobDescription) {
      this.navigateToJobDescription.emit(companyJobViewListItem);
    }
  }

  handleJobDescriptionHistoryClick(jobDescriptionId: number, jobTitle: string) {
    this.openJobDescriptionHistoryModal.emit({ jobDescriptionId: jobDescriptionId, jobTitle: jobTitle });
  }

  handleNewJobDescriptionClick(companyJobViewListItem: CompanyJobViewListItem) {
    this.openNewJobDescriptionModal.emit(companyJobViewListItem);
  }

  setTemplateView(companyJobViewListItem) {
    event.stopPropagation();
    this.publicViewChanged.emit(companyJobViewListItem);
  }

  setColumnWidth(columnDatabaseName: string) {
    let pixels: number;

    switch (columnDatabaseName) {
      case JobDescriptionColumn.JobTitle:
        pixels = 250;
        break;

      case JobDescriptionColumn.JobDescriptionTitle:
        pixels = 250;
        break;

      case JobDescriptionColumn.PublicView:
        pixels = 120;
        break;

      case JobDescriptionColumn.VersionNumber:
        pixels = 120;
        break;

      default:
        pixels = 150;
    }

    return pixels;
  }

  setFilterable(columnDatabaseName: string) {
    let filterable: boolean;

    switch (columnDatabaseName) {
      case JobDescriptionColumn.VersionNumber:
        filterable = false;
        break;

      default:
        filterable = true;
        break;
    }

    return filterable;
  }

  setColumnVisibility(column: ListAreaColumn): boolean {
    let isHidden: boolean;

    switch (column.ColumnDatabaseName) {
      case JobDescriptionColumn.PublicView:
        isHidden = !this.canRestrictJobDescriptionFromPublicView ? true : !column.Visible;
        break;

      case JobDescriptionColumn.VersionNumber:
        isHidden = !column.Visible && !this.isPublic;
        break;

      case JobDescriptionColumn.JobDescriptionStatus:
        isHidden = !column.Visible && !this.isPublic;
        break;

      default:
        isHidden = !column.Visible;
        break;
    }

    return isHidden;
  }

  setColumnClass(columnDatabaseName: string) {
    let columnClass;

    switch (columnDatabaseName) {
      case JobDescriptionColumn.PublicView:
        columnClass = 'text-center';
        break;

      case JobDescriptionColumn.VersionNumber:
        columnClass = 'text-center';
        break;

      case JobDescriptionColumn.JobDescriptionStatus:
        columnClass = 'text-center';
        break;

      default:
        columnClass = undefined;
        break;
    }

    return columnClass;
  }
}
