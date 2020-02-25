import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { SyncScheduleHrisApiService } from 'libs/data/payfactors-api/hris-api/sync-schedules';
import { generateOutboundTransferScheduleSummary, TransferScheduleSummary } from 'libs/models/hris-api/sync-schedule';
import * as fromRootState from 'libs/state/state';

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
  loadOutboundTransferScheduleSummary$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTransferScheduleActions.GET_OUTBOUND_TRANSFER_SUMMARY),
      withLatestFrom(
        this.store.pipe(select(fromDataManagementMainReducer.getOutboundTransferSummaryObj)),
        (action, summary) => {
          return {
            action,
            summary
          };
        }
      ),
      switchMap((obj) => {
        const arr = obj.summary.obj.length > 0 ? obj.summary.obj : generateOutboundTransferScheduleSummary();
        return of(arr).map(x => new fromTransferScheduleActions.GetOutboundTransferSummarySuccess(x));
      })
    );

  @Effect()
  disableTransferSchedule$: Observable<Action> = this.actions$
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
  enableTransferSchedule$: Observable<Action> = this.actions$
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
  saveTransferSchedule$: Observable<Action> = this.actions$
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

  @Effect()
  saveOutboundTransferSchedule$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTransferScheduleActions.SAVE_OUTBOUND_TRANSFER_SCHEDULE),
      withLatestFrom(
        this.store.pipe(select(fromDataManagementMainReducer.getOutboundTransferSummaryObj)),
        (action: fromTransferScheduleActions.SaveOutboundTransferSchedule, summary) => {
          return {
            action,
            summary
          };
        }
      ),
      switchMap((obj) => {
        const val: TransferScheduleSummary = {
          ...obj.summary.obj[0],
          syncSchedule_ID: 1,
          expression: obj.action.payload.Expression,
          active: obj.action.payload.Active === true ? 1 : 0
        };
        return of(val).map(x => new fromTransferScheduleActions.SaveOutboundTransferScheduleSuccess(x));
      })
    );

  @Effect()
  saveAllTransferSchedule$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTransferScheduleActions.SAVE_ALL_TRANSFER_SCHEDULES),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        (action: fromTransferScheduleActions.SaveAllTransferSchedules, userContext) => {
          return {
            action,
            userContext
          };
        }
      ),
      switchMap((obj) => {
        return this.syncScheduleHrisApiService.bulkUpsertTransferSchedule(obj.userContext, obj.action.payload.schedules)
          .pipe(
            map((response: TransferScheduleSummary[]) => {
              return new fromTransferScheduleActions.SaveAllTransferSchedulesSuccess({summary: response, route: obj.action.payload.route});
            }),
            catchError(e => of(new fromTransferScheduleActions.SaveAllTransferSchedulesError()))
          );
      })
    );

  @Effect({dispatch: false})
  saveAllTransferSchedulesSuccess$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTransferScheduleActions.SAVE_ALL_TRANSFER_SCHEDULES_SUCCESS),
      tap((action: fromTransferScheduleActions.SaveAllTransferSchedulesSuccess) => {
        if (action.payload) {
          return this.router.navigate([action.payload.route]);
        }
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromDataManagementMainReducer.State>,
    private syncScheduleHrisApiService: SyncScheduleHrisApiService,
    private router: Router
  ) {}
}
