import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { GridDataResult, DataStateChangeEvent, RowClassArgs, RowArgs } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

import { GridTypeEnum, SelectAllStatus } from 'libs/models/common';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromJobDescriptionInboxReducer from '../../reducers/';
import * as fromJobDescriptionInboxActions from '../../actions/job-description-inbox.actions';
import { inboxGridFields } from '../../models';


@Component({
    selector: 'pf-job-description-inbox-grid',
    templateUrl: './job-description-inbox-grid.component.html',
    styleUrls: ['./job-description-inbox-grid.component.scss']
})

export class JobDescriptionInboxGridComponent implements OnDestroy, OnInit {
  @ViewChild(TooltipDirective, { static: true }) public tooltipDir: TooltipDirective;
  gridFields = inboxGridFields;
  inboxCount$: Observable<number>;
  inboxGridData$: Observable<GridDataResult>;
  inboxGridState$: Observable<State>;
  inboxInfoAlertFormat$: Observable<string>;
  inboxLoading$: Observable<boolean>;
  inboxLoadingError$: Observable<boolean>;
  inboxSelectAllPages$: Observable<boolean>;
  pageLength$: Observable<number>;
  selectAllStatus = SelectAllStatus;
  selectAllStatus$: Observable<string>;
  selectedIds = new Set<number>();
  selectedIds$: Observable<Set<number>>;
  selectedIdsSubscription: Subscription;

  isRowSelected = (row: RowArgs) => this.selectedIds && this.selectedIds.has(row.dataItem.CompanyWorkflowStepUserId);

  constructor(private store: Store<fromJobDescriptionInboxReducer.State>, private router: Router) {}

  ngOnDestroy(): void {
    this.store.dispatch(new fromJobDescriptionInboxActions.UnselectAll());
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.JobDescriptionInbox));

    this.selectedIdsSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.inboxCount$ = this.store.pipe(select(fromJobDescriptionInboxReducer.getInboxCount));
    this.inboxGridData$ = this.store.pipe(select(fromJobDescriptionInboxReducer.getInboxGridData));
    this.inboxGridState$ = this.store.pipe(select(fromJobDescriptionInboxReducer.getInboxGridState));
    this.inboxInfoAlertFormat$ = this.store.pipe(select(fromJobDescriptionInboxReducer.getInboxInfoAlertFormat));
    this.inboxLoading$ = this.store.pipe(select(fromJobDescriptionInboxReducer.getInboxLoading));
    this.inboxLoadingError$ = this.store.pipe(select(fromJobDescriptionInboxReducer.getInboxLoadingError));
    this.inboxSelectAllPages$ = this.store.pipe(select(fromJobDescriptionInboxReducer.getInboxSelectAllPages));
    this.pageLength$ = this.store.pipe(select(fromJobDescriptionInboxReducer.getPageLength));
    this.selectAllStatus$ = this.store.pipe(select(fromJobDescriptionInboxReducer.getSelectAllStatus));
    this.selectedIds$ = this.store.pipe(select(fromJobDescriptionInboxReducer.getSelectedIds));

    this.selectedIdsSubscription = this.selectedIds$.subscribe((ids) => {
      this.selectedIds = ids;
    });
  }

  getRowClass(context: RowClassArgs): string {
    return 'clickable-row';
  }

  onCellClick({ dataItem, rowIndex, originalEvent, column }): void {
    if (!dataItem?.JobDescriptionId || originalEvent.button !== 0 || column.field === undefined) {
      return;
    }

    if (!dataItem.IsRead) {
      this.store.dispatch(new fromJobDescriptionInboxActions.UpdateJobDescriptionRead(dataItem.CompanyWorkflowStepUserId));
    }
    this.router.navigate([`job-descriptions/${dataItem.JobDescriptionId}`], { queryParams: { 'jwt-workflow': dataItem.Token } });
  }

  onDataStateChange(state: DataStateChangeEvent): void {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.JobDescriptionInbox, state));
    this.store.dispatch(new fromJobDescriptionInboxActions.LoadInbox());
    this.store.dispatch(new fromJobDescriptionInboxActions.GetUnreadInboxCount());
  }

  onEnvelopeSelected(isRead: boolean, companyWorkflowStepUserId: number): void {
    if (isRead) {
      this.store.dispatch(new fromJobDescriptionInboxActions.UpdateJobDescriptionUnread(companyWorkflowStepUserId));
    } else {
      this.store.dispatch(new fromJobDescriptionInboxActions.UpdateJobDescriptionRead(companyWorkflowStepUserId));
    }
  }

  onIdSelected(companyWorkflowStepUserId: number): void {
    this.store.dispatch(new fromJobDescriptionInboxActions.SelectId(companyWorkflowStepUserId));
  }

  onSelectAllChange(): void {
    this.store.dispatch(new fromJobDescriptionInboxActions.SelectAll());
  }

  onSelectAllClicked(): void {
    this.store.dispatch(new fromJobDescriptionInboxActions.SelectAllPages());
  }

  showGridTooltip(e: any): void {
    if ((e.target.offsetWidth < e.target.scrollWidth) && e.target.classList.contains('show-tooltip')) {
      this.tooltipDir.toggle(e.target);
    } else {
      this.tooltipDir.hide();
    }
  }
}
