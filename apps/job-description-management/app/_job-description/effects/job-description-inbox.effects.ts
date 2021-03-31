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
  updateCompanyWorkflowStepUsersIsRead$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobDescriptionInboxActions.UPDATE_INBOX_READ),
    switchMap((action: fromJobDescriptionInboxActions.UpdateInboxRead) =>
    this.jobDescriptionManagementApiService.updateCompanyWorkflowStepUsersIsReadById(
      action.payload.IsRead, [action.payload.CompanyWorkflowStepUserId])
    .pipe(
      map(() => {
        return new fromJobDescriptionInboxActions.UpdateInboxReadSuccess();
      }),
      catchError(() => of(new fromJobDescriptionInboxActions.UpdateInboxReadError()))
      )
    ));

  @Effect()
  updateCompanyWorkflowStepUsersIsReadBulk$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobDescriptionInboxActions.UPDATE_INBOX_READ_BULK),
    withLatestFrom(
      this.store.pipe(select(fromJobDescriptionReducer.getSelectedIds)),
      (action: fromJobDescriptionInboxActions.UpdateInboxReadBulk, workflowStepUserIds: Set<number>) => ({ action, workflowStepUserIds })
    ),
    switchMap((obj) => this.jobDescriptionManagementApiService.updateCompanyWorkflowStepUsersIsReadById(
      obj.action.payload, [...obj.workflowStepUserIds])
    .pipe(
      map(() => {
        return new fromJobDescriptionInboxActions.UpdateInboxReadBulkSuccess(obj.action.payload);
      }),
      catchError(() => of(new fromJobDescriptionInboxActions.UpdateInboxReadBulkError()))
      )
    ));

    @Effect()
    updateCompanyWorkflowStepUsersIsReadAll$: Observable<Action> = this.actions$.pipe(
      ofType(fromJobDescriptionInboxActions.UPDATE_INBOX_READ_ALL),
      switchMap((action: fromJobDescriptionInboxActions.UpdateInboxReadAll) =>
      this.jobDescriptionManagementApiService.updateCompanyWorkflowStepUsersIsReadAll(action.payload)
      .pipe(
        map(() => {
          return new fromJobDescriptionInboxActions.UpdateInboxReadAllSuccess(action.payload);
        }),
        catchError(() => of(new fromJobDescriptionInboxActions.UpdateInboxReadAllError()))
        )
    ));

  constructor(
    private store: Store<fromJobDescriptionReducer.State>,
    private actions$: Actions,
    private jobDescriptionManagementApiService: JobDescriptionManagementApiService) {}
}
