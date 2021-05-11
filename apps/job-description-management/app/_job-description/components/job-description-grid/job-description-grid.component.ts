import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { GridDataResult, RowArgs, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';

import { AbstractFeatureFlagService, FeatureFlags, PermissionService, RealTimeFlag } from 'libs/core';
import { ListAreaColumn } from 'libs/models/common';
import { Permissions, PermissionCheckEnum } from 'libs/constants';

import { CompanyJobViewListItem } from '../../models';
import { JobDescriptionManagementJobDescriptionState, getJobDescriptionCreating, getSelectedJobDescriptions } from '../../reducers';
import { JobDescriptionColumn } from '../../constants/job-description-column.constants';

import * as jobDescriptionGridActions from '../../actions/job-description-grid.actions';

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
  @Output() openDeleteJobDescriptionModal = new EventEmitter();
  @Output() bulkRouteJobDescriptions = new EventEmitter();

  jdmCheckboxesFeatureFlag: RealTimeFlag = { key: FeatureFlags.JdmCheckboxes, value: false };

  public filterChanged: any;
  public permissions = Permissions;
  public pageableSettings = {
    buttonCount: 5,
    info: true,
    type: 'numeric',
    pageSizes: false,
    previousNext: true
  };
  public hasDeleteJobDescriptionPermission: boolean;
  public currentReviewerThreshold = 40;

  private creatingJobDescription: boolean;
  private creatingJobDescription$: Observable<boolean>;
  private creatingJobDescriptionSubscription: Subscription;

  private getSelectedJobDescriptions$: Observable<Map<number, any>>;
  private getSelectedJobDescriptionsSubscription: Subscription;

  private selectedJobDescriptions: Map<number, any>;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store<JobDescriptionManagementJobDescriptionState>,
    private permissionService: PermissionService,
    private featureFlagService: AbstractFeatureFlagService,
  ) {
    this.creatingJobDescription$ = this.store.select(getJobDescriptionCreating);
    this.getSelectedJobDescriptions$ = this.store.select(getSelectedJobDescriptions);
    this.hasDeleteJobDescriptionPermission = this.permissionService.CheckPermission([Permissions.CAN_DELETE_JOB_DESCRIPTION],
      PermissionCheckEnum.Single);
    this.featureFlagService.bindEnabled(this.jdmCheckboxesFeatureFlag, this.unsubscribe$);
  }

  isRowSelected = (e: RowArgs) => this.isSelectedJobDescription(e.dataItem.JobDescriptionId);

  isSelectedJobDescription(jobDescriptionId: number): boolean {
    return this.selectedJobDescriptions?.has(jobDescriptionId);
  }

  get bulkRouteTooltip(): string {
    return this.selectedJobDescriptions?.size > 0 && !this.canBulkRouteJobDescriptions()
      ? 'Only Draft Job Descriptions can be routed for approval' : '';
  }

  get bulkDeleteTooltip(): string {
return this.selectedJobDescriptions?.size > 0 && !this.canBulkDeleteJobDescriptions()
    ? 'Only Job Descriptions that have at least one sibling can be deleted' : '';
  }

  ngOnInit() {
    this.creatingJobDescriptionSubscription = this.creatingJobDescription$.subscribe((creatingJobDescription) => {
      this.creatingJobDescription = creatingJobDescription;
    });

    this.getSelectedJobDescriptionsSubscription = this.getSelectedJobDescriptions$.subscribe((selectedJobDescriptions) => {
      this.selectedJobDescriptions = selectedJobDescriptions;
    });
  }

  ngOnDestroy() {
    this.creatingJobDescriptionSubscription.unsubscribe();
    this.getSelectedJobDescriptionsSubscription.unsubscribe();
    this.unsubscribe$.next();
  }

  handleSelectionChange(selection: any): void {
    let selectionChanged = false;
    if (selection.selectedRows.length > 0) {
      selection.selectedRows.forEach((row) => {
        if (this.canSelectRow(row.dataItem)) {
          selectionChanged = true;
          this.selectedJobDescriptions?.set(row.dataItem.JobDescriptionId, row.dataItem);
      }});
    }

    if (selection.deselectedRows.length > 0) {
      selection.deselectedRows.forEach((row) => {
        if (this.canSelectRow(row.dataItem)) {
          selectionChanged = true;
          this.selectedJobDescriptions?.delete(row.dataItem.JobDescriptionId);
      }});
    }

    if (selectionChanged) {
      this.store.dispatch(new jobDescriptionGridActions.SelectJobDescriptions(this.selectedJobDescriptions));
    }
  }

  canSelectRow(jd): boolean {
    return jd.JobDescriptionId && jd.JobDescriptionStatus !== 'Routing' ? true : false;
  }

  handleJobDescriptionHistoryClick(jobDescriptionId: number, jobTitle: string) {
    this.openJobDescriptionHistoryModal.emit({ jobDescriptionId: jobDescriptionId, jobTitle: jobTitle });
  }

  handleNewJobDescriptionClick(companyJobViewListItem: CompanyJobViewListItem) {
    this.openNewJobDescriptionModal.emit(companyJobViewListItem);
  }

  handleDeleteJobDescriptionClick(jobDescriptionId) {
    this.openDeleteJobDescriptionModal.emit(jobDescriptionId);
  }

  hideCurrentReviewerTooltip(ngbTooltip: NgbTooltip) {
    if (ngbTooltip.isOpen()) {
      ngbTooltip.close();
    }
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

  showCurrentReviewerTooltip(currentReviewer: string, ngbTooltip: NgbTooltip) {
    if (currentReviewer.trim().length > this.currentReviewerThreshold) {
      ngbTooltip.open();
    }
  }

  tooltipForDeleteButton(jobDescriptionCount: number): string {
    if (jobDescriptionCount <= 1 ) {
      return 'Job code should have at least one job description record';
    }
  }

  onCellClick(event: any) {
    if (event?.dataItem.JobDescriptionStatus === 'Routing') {
      return;
    }
    const companyJobViewListItem: CompanyJobViewListItem = event?.dataItem;
    if (!this.creatingJobDescription) {
      this.navigateToJobDescription.emit(companyJobViewListItem);
    }
  }

  handleClearSelectionsClicked() {
    this.selectedJobDescriptions.clear();
    this.store.dispatch(new jobDescriptionGridActions.SelectJobDescriptions(this.selectedJobDescriptions));
  }

  handleBulkRouteForApprovalClicked(): void {
    this.bulkRouteJobDescriptions.emit();
  }

  canBulkDeleteJobDescriptions(): boolean {
    let canDelete = true;
    this.selectedJobDescriptions?.forEach(jobDescription => {
      if (jobDescription.JobDescriptionCount <= 1) {
        canDelete = false;
        return;
      }
    });
    return canDelete;
  }

  canBulkRouteJobDescriptions(): boolean {
    let canRoute = true;
    this.selectedJobDescriptions?.forEach(jobDescription => {
      if (jobDescription.JobDescriptionStatus !== 'Draft') {
        canRoute = false;
        return;
      }
    });
    return canRoute;
  }

  getSelectAllState(): SelectAllCheckboxState {
    const selectedIds = Array.from(this.selectedJobDescriptions?.keys());
    const eligiblePageIds =  this.gridDataResult?.data?.filter(x => this.canSelectRow(x)).map(jd => jd.JobDescriptionId);

    if (eligiblePageIds.every(r => selectedIds.includes(r))) {
      return 'checked';
    } else if (eligiblePageIds.filter(r => selectedIds.includes(r))?.length === 0) {
      return 'unchecked';
    } else {
      return 'indeterminate';
    }
  }

  public rowClass(args) {
    const isRouting = args.dataItem.JobDescriptionStatus === 'Routing';
    if (isRouting) {
      return {
        'k-disabled': true
      };
    }
  }
}
