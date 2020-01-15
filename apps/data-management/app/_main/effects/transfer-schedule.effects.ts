import {Injectable} from '@angular/core';

import {Action, select, Store} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';

import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';

import * as fromRootState from 'libs/state/state';

import {SyncScheduleHrisApiService} from 'libs/data/payfactors-api/hris-api/sync-schedules';
import {TransferScheduleSummary} from 'libs/models/hris-api/sync-schedule';

import * as fromTransferScheduleActions from '../actions/transfer-schedule.actions';
import * as fromDataManagementMainReducer from '../reducers';

@Injectable()
export class TransferScheduleEffects {

  @Effect()
  loadTransferScheduleSummary$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTransferScheduleActions.GET_TRANSFER_SUMMARY),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        (action, userContext) => {
          return {
            action,
            userContext
          };
        }
      ),
      switchMap((obj) => {
        return this.syncScheduleHrisApiService.getTransferScheduleSummary(obj.userContext)
          .pipe(
            map((response: TransferScheduleSummary[]) => {
              return new fromTransferScheduleActions.GetTransferSummarySuccess(response);
            }),
            catchError(e => of(new fromTransferScheduleActions.GetTransferSummaryError()))
          );
      })
    );

  @Effect()
  disableTransferSchedule: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTransferScheduleActions.DISABLE_TRANSFER_SCHEDULE),
      withLatestFrom(
        this.store.select(fromDataManagementMainReducer.getTransferScheduleSummarySavingScheduleId),
        this.store.pipe(select(fromRootState.getUserContext)),
        (action, scheduleId, userContext) => {
          return {
            action,
            scheduleId,
            userContext
          };
        }
      ),
      switchMap((obj) => {
        return this.syncScheduleHrisApiService.disableTransferSchedule(obj.userContext, obj.scheduleId)
          .pipe(
            map((response: TransferScheduleSummary[]) => {
              return new fromTransferScheduleActions.DisableTransferScheduleSuccess();
            }),
            catchError(e => of(new fromTransferScheduleActions.DisableTransferScheduleError()))
          );
      })
    );

  @Effect()
  enableTransferSchedule: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTransferScheduleActions.ENABLE_TRANSFER_SCHEDULE),
      withLatestFrom(
        this.store.select(fromDataManagementMainReducer.getTransferScheduleSummarySavingScheduleId),
        this.store.pipe(select(fromRootState.getUserContext)),
        (action, scheduleId, userContext) => {
          return {
            action,
            scheduleId,
            userContext
          };
        }
      ),
      switchMap((obj) => {
        return this.syncScheduleHrisApiService.enableTransferSchedule(obj.userContext, obj.scheduleId)
          .pipe(
            map((response: TransferScheduleSummary[]) => {
              return new fromTransferScheduleActions.EnableTransferScheduleSuccess();
            }),
            catchError(e => of(new fromTransferScheduleActions.EnableTransferScheduleError()))
          );
      })
    );

  @Effect()
  saveTransferSchedule: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTransferScheduleActions.SAVE_TRANSFER_SCHEDULE),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        (action: fromTransferScheduleActions.SaveTransferSchedule, userContext) => {
          return {
            action,
            userContext
          };
        }
      ),
      switchMap((obj) => {
        return this.syncScheduleHrisApiService.upsertTransferSchedule(obj.userContext, obj.action.payload)
          .pipe(
            map((response: TransferScheduleSummary) => {
              return new fromTransferScheduleActions.SaveTransferScheduleSuccess(response);
            }),
            catchError(e => of(new fromTransferScheduleActions.SaveTransferScheduleError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromDataManagementMainReducer.State>,
    private syncScheduleHrisApiService: SyncScheduleHrisApiService
  ) {}
}
