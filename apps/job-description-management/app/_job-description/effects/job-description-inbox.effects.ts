import { Injectable } from '@angular/core';

import { select, Action, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom, mergeMap } from 'rxjs/operators';

import { JobDescriptionManagementApiService } from 'libs/data/payfactors-api';
import { JobDescriptionInboxResponse } from 'libs/models/payfactors-api';

import * as fromJobDescriptionInboxActions from '../actions/job-description-inbox.actions';
import * as fromJobDescriptionReducer from '../reducers';


@Injectable()
export class JobDescriptionInboxEffects {

  @Effect()
  getUnreadInboxCount$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobDescriptionInboxActions.GET_UNREAD_INBOX_COUNT),
    mergeMap(() => this.jobDescriptionManagementApiService.getUnreadInboxCount()
      .pipe(
        map((unreadCount) => {
          return new fromJobDescriptionInboxActions.GetUnreadInboxCountSuccess(unreadCount);
        }),
        catchError(() => of(new fromJobDescriptionInboxActions.GetUnreadInboxCountError()))
      ))
    );

  @Effect()
  loadInbox$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobDescriptionInboxActions.LOAD_INBOX),
    withLatestFrom(
      this.store.pipe(select(fromJobDescriptionReducer.getInboxSearchTerm)),
      this.store.pipe(select(fromJobDescriptionReducer.getInboxGridState)),
      (action: fromJobDescriptionInboxActions.LoadInbox, searchTerm: string, gridState) => ({ searchTerm, gridState })
    ),
    switchMap((gridData) => this.jobDescriptionManagementApiService.getUserInbox({
        Count: gridData.gridState.take,
        From: gridData.gridState.skip,
        SearchTerm: gridData.searchTerm,
        SortBy: gridData.gridState.sort?.length ?  gridData.gridState.sort[0].field : null,
        SortDirection: gridData.gridState.sort?.length ?  gridData.gridState.sort[0].dir : null
      }).pipe(
      map((statements: JobDescriptionInboxResponse) => {
        return new fromJobDescriptionInboxActions.LoadInboxSuccess({
          total: statements.TotalCount,
          data: statements.Data
        });
      }),
      catchError(() => of(new fromJobDescriptionInboxActions.LoadInboxError()))
      )
    ));

  @Effect()
  updateCompanyWorkflowStepUsersIsReadBulk$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobDescriptionInboxActions.UPDATE_INBOX_READ_BULK),
    withLatestFrom(
      this.store.pipe(select(fromJobDescriptionReducer.getSelectedIds)),
      (action: fromJobDescriptionInboxActions.UpdateInboxReadBulk, workflowStepUserIds: Set<number>) => ({ action, workflowStepUserIds })
    ),
    switchMap((obj) => this.jobDescriptionManagementApiService.updateCompanyWorkflowStepUsersIsReadById(true, [...obj.workflowStepUserIds])
    .pipe(
      map(() => {
        return new fromJobDescriptionInboxActions.UpdateInboxReadBulkSuccess();
      }),
      catchError(() => of(new fromJobDescriptionInboxActions.UpdateInboxReadBulkError()))
      )
    ));

  @Effect()
  updateCompanyWorkflowStepUsersIsReadSelectAll$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobDescriptionInboxActions.UPDATE_INBOX_READ_SELECT_ALL),
    mergeMap(() => this.jobDescriptionManagementApiService.updateCompanyWorkflowStepUsersIsReadAll(true)
    .pipe(
      map(() => {
        return new fromJobDescriptionInboxActions.UpdateInboxReadSelectAllSuccess();
      }),
      catchError(() => of(new fromJobDescriptionInboxActions.UpdateInboxReadSelectAllError()))
      )
  ));

  @Effect()
  updateCompanyWorkflowStepUsersIsUnreadBulk$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobDescriptionInboxActions.UPDATE_INBOX_UNREAD_BULK),
    withLatestFrom(
      this.store.pipe(select(fromJobDescriptionReducer.getSelectedIds)),
      (action: fromJobDescriptionInboxActions.UpdateInboxUnreadBulk, workflowStepUserIds: Set<number>) => ({ action, workflowStepUserIds })
    ),
    switchMap((obj) => this.jobDescriptionManagementApiService.updateCompanyWorkflowStepUsersIsReadById(false, [...obj.workflowStepUserIds])
    .pipe(
      map(() => {
        return new fromJobDescriptionInboxActions.UpdateInboxUnreadBulkSuccess();
      }),
      catchError(() => of(new fromJobDescriptionInboxActions.UpdateInboxUnreadBulkError()))
      )
    ));

  @Effect()
  updateCompanyWorkflowStepUsersIsUnreadSelectAll$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobDescriptionInboxActions.UPDATE_INBOX_UNREAD_SELECT_ALL),
    mergeMap(() => this.jobDescriptionManagementApiService.updateCompanyWorkflowStepUsersIsReadAll(false)
    .pipe(
      map(() => {
        return new fromJobDescriptionInboxActions.UpdateInboxUnreadSelectAllSuccess();
      }),
      catchError(() => of(new fromJobDescriptionInboxActions.UpdateInboxUnreadSelectAllError()))
      )
  ));

  @Effect()
  updateCompanyWorkflowStepUsersIsRead$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobDescriptionInboxActions.UPDATE_JOB_DESCRIPTION_READ),
    switchMap((action: fromJobDescriptionInboxActions.UpdateJobDescriptionRead) =>
    this.jobDescriptionManagementApiService.updateCompanyWorkflowStepUsersIsReadById(true, [action.payload])
    .pipe(
      map(() => {
        return new fromJobDescriptionInboxActions.UpdateJobDescriptionReadSuccess(action.payload);
      }),
      catchError(() => of(new fromJobDescriptionInboxActions.UpdateJobDescriptionReadError()))
      )
    ));

    @Effect()
    updateCompanyWorkflowStepUsersIsUnread$: Observable<Action> = this.actions$.pipe(
      ofType(fromJobDescriptionInboxActions.UPDATE_JOB_DESCRIPTION_UNREAD),
      switchMap((action: fromJobDescriptionInboxActions.UpdateJobDescriptionUnread) =>
      this.jobDescriptionManagementApiService.updateCompanyWorkflowStepUsersIsReadById(false, [action.payload])
      .pipe(
        map(() => {
          return new fromJobDescriptionInboxActions.UpdateJobDescriptionUnreadSuccess(action.payload);
        }),
        catchError(() => of(new fromJobDescriptionInboxActions.UpdateJobDescriptionUnreadError()))
        )
      ));

  constructor(
    private store: Store<fromJobDescriptionReducer.State>,
    private actions$: Actions,
    private jobDescriptionManagementApiService: JobDescriptionManagementApiService) {}
}
